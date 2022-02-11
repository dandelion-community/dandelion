import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type {
  AidRequestHistoryEvent,
  AidRequestHistoryEventType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';

export default function getHistoryWithoutRemovals(
  aidRequest: AidRequest,
): Array<AidRequestHistoryEvent> {
  const history = aidRequest.history;
  const toRemove = new Set<AidRequestHistoryEvent>();
  const unpairedAdds: Map<string, AidRequestHistoryEvent> = new Map();
  [...history]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .forEach((historyEvent) => {
      const { action, actor, event, eventSpecificData } = historyEvent;
      const key = `${actor}.${encodeDetails(event, eventSpecificData)}`;
      if (action === 'Add') {
        unpairedAdds.set(key, historyEvent);
      } else {
        const unpairedEvent = unpairedAdds.get(key);
        if (unpairedEvent != null) {
          unpairedAdds.delete(key);
          toRemove.add(historyEvent);
          toRemove.add(unpairedEvent);
        }
      }
    });
  return history.filter((event) => !toRemove.has(event));
}

function encodeDetails(
  event: AidRequestHistoryEventType,
  eventSpecificData: string | undefined,
): string {
  switch (event) {
    case 'Completed':
    case 'Created':
    case 'WorkingOn':
    case 'Deleted':
      return event;
    case 'Comment':
      return `Comment:${eventSpecificData ?? ''}`;
  }
}

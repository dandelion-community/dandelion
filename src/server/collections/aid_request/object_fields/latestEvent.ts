import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type {
  AidRequestHistoryEvent,
  AidRequestHistoryEventType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const latestEvent: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<string> => {
    const viewer = assertLoggedIn(req, 'AidRequest.latestEvent');
    const aidRequest = await loadAidRequestForViewer(viewer, aidRequestID);
    const { history: rawHistory } = aidRequest;
    const history = filterRemovals(rawHistory);
    if (history.length === 0) {
      const recorder = await getWhoRecordedRequest(aidRequest);
      return `${timeAgo.format(aidRequest.createdAt)} - ${
        recorder?.displayName ?? 'Unknown'
      } recorded this`;
    }
    const event = history.reduce((latestEvent, currentEvent) =>
      currentEvent.timestamp > latestEvent.timestamp
        ? currentEvent
        : latestEvent,
    );
    const actor = await UserModel.findById(event.actor);
    if (actor == null) {
      throw new Error('Action must have actor');
    }
    const actorIsViewer = actor._id.equals(viewer._id);
    return `${timeAgo.format(event.timestamp)} - ${
      actorIsViewer ? 'You' : actor.displayName
    } ${getActionText(event.event)}`;
  },
  type: 'String!',
};

function getActionText(event: AidRequestHistoryEventType): string {
  switch (event) {
    case 'WorkingOn':
      return 'started working on it';
    case 'Completed':
      return 'completed this';
    case 'Created':
      return 'recorded this';
    case 'Deleted':
      return 'deleted this';
    case 'Comment':
      return 'commented';
  }
}

export default latestEvent;

function filterRemovals(
  history: Array<AidRequestHistoryEvent>,
): Array<AidRequestHistoryEvent> {
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

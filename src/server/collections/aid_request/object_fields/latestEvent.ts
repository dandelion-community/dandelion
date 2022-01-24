import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { Document } from 'mongoose';
import type {
  AidRequestHistoryEvent,
  AidRequestHistoryEventPayload,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const latestEvent: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
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
    } ${getActionText(event.details)}`;
  },
  type: 'String!',
};

function getActionText(details: AidRequestHistoryEventPayload): string {
  switch (details.event) {
    case 'WorkingOn':
      return 'started working on it';
    case 'Completed':
      return 'completed this';
    case 'Created':
      return 'recorded this';
    case 'Deleted':
      return 'deleted this';
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
    .forEach((event) => {
      const { action, actor, details } = event;
      const key = `${actor}.${encodeDetails(details)}`;
      if (action === 'Add') {
        unpairedAdds.set(key, event);
      } else {
        const unpairedEvent = unpairedAdds.get(key);
        if (unpairedEvent != null) {
          unpairedAdds.delete(key);
          toRemove.add(event);
          toRemove.add(unpairedEvent);
        }
      }
    });
  return history.filter((event) => !toRemove.has(event));
}

function encodeDetails(details: AidRequestHistoryEventPayload): string {
  switch (details.event) {
    case 'Completed':
    case 'Created':
    case 'WorkingOn':
    case 'Deleted':
      return details.event;
  }
}

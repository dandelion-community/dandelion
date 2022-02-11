import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type { AidRequestHistoryEventType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import getHistoryWithoutRemovals from 'src/server/collections/aid_request/helpers/getHistoryWithoutRemovals';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import ago from 'src/shared/utils/ago';

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
    const history = getHistoryWithoutRemovals(aidRequest);
    if (history.length === 0) {
      const recorder = await getWhoRecordedRequest(aidRequest);
      return `${ago(aidRequest.createdAt)} - ${
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
    return `${ago(event.timestamp)} - ${
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

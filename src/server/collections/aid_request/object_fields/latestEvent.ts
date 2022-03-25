import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type {
  AidRequestActionType,
  AidRequestHistoryEventType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
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
    const viewer = assertLoggedIn(req, 'AidRequest.latestEvent', {
      assertUIIsHandlingErrors: true,
    });
    const aidRequest = await loadAidRequestForViewer(viewer, aidRequestID);
    const { history } = aidRequest;
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
    } ${getActionText(event.event, event.action)}`;
  },
  type: 'String!',
};

function getActionText(
  event: AidRequestHistoryEventType,
  action: AidRequestActionType,
): string {
  switch (action) {
    case 'Add':
      return (() => {
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
          case 'ChangedWhatIsNeeded':
          case 'ChangedWhoIsItFor':
            return 'edited';
        }
      })();
    case 'Remove':
      return (() => {
        switch (event) {
          case 'WorkingOn':
            return 'stopped working on it';
          case 'Completed':
            return 'marked as incomplete';
          case 'Created':
            return 'un-created this';
          case 'Deleted':
            return 'un-deleted this';
          case 'Comment':
            return 'un-commented';
          case 'ChangedWhatIsNeeded':
          case 'ChangedWhoIsItFor':
            return 'un-edited';
        }
      })();
  }
}

export default latestEvent;

import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type {
  AidRequest,
  AidRequestActivityItem,
} from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import ago from 'src/shared/utils/ago';
import loadUserForViewer from '../../user/loader/loadUserForViewer';
import { AidRequestHistoryEvent } from '../AidRequestModelTypes';

type ReturnType = AidRequestActivityItem[];
const GraphQLType = '[AidRequestActivityItem!]!';

const history: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<ReturnType> => {
    const viewer = assertLoggedIn(req, 'AidRequest.history');
    const aidRequest = await loadAidRequestForViewer(viewer, aidRequestID);
    return aidRequest.history
      .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
      .map(
        (event: AidRequestHistoryEvent): AidRequestActivityItem => ({
          _id: (event as unknown as { _id: string })._id,
          actor: async (): Promise<Express.User | null> => {
            return await loadUserForViewer(viewer, event.actor.toString());
          },
          isComment: event.event === 'Comment',
          message: getMessage(event),
          when: ago(event.timestamp),
        }),
      );
  },
  type: GraphQLType,
};

function getMessage(event: AidRequestHistoryEvent): string {
  switch (event.event) {
    case 'Comment':
      return event.eventSpecificData ?? '';
    case 'Completed':
      return (() => {
        switch (event.action) {
          case 'Add':
            return 'Marked this as complete';
          case 'Remove':
            return 'Marked this as incomplete';
        }
      })();
    case 'Created':
      return 'Recorded this';
    case 'Deleted':
      return (() => {
        switch (event.action) {
          case 'Add':
            return 'Deleted this';
          case 'Remove':
            return 'Restored this from deletion';
        }
      })();
    case 'WorkingOn':
      return (() => {
        switch (event.action) {
          case 'Add':
            return 'Started working on this';
          case 'Remove':
            return 'Stopped working on this';
        }
      })();
  }
}

export default history;

import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type {
  AidRequest,
  AidRequestActivityItem,
} from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestHistoryEvent } from 'src/server/collections/aid_request/AidRequestModelTypes';
import getHistoryEventSummary from 'src/server/collections/aid_request/helpers/getHistoryEventSummary';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import loadUserForViewer from 'src/server/collections/user/loader/loadUserForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import ago from 'src/shared/utils/ago';

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
          message: async (): Promise<string> =>
            await getHistoryEventSummary(viewer, event),
          when: ago(event.timestamp),
        }),
      );
  },
  type: GraphQLType,
};

export default history;

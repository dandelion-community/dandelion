import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import type {
  AidRequestHistoryEventForGraphQL,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const history: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<AidRequestHistoryEventForGraphQL>> => {
    const user = assertLoggedIn(req, 'AidRequest.history');
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    return aidRequest.history.map((event) => ({
      action: event.action,
      actor: async (): Promise<Express.User | null> => {
        return await UserModel.findById(event.actor);
      },
      aidRequest: async () => aidRequest,
      details: event.details,
      postpublishSummary: '',
      timestamp: event.timestamp,
      undoID: event.undoID,
    }));
  },
  type: '[AidRequestHistoryEvent]',
};

export default history;

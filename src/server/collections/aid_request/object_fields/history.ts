import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type {
  AidRequestHistoryEventForGraphQL,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const history: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<AidRequestHistoryEventForGraphQL>> => {
    assertLoggedIn(req, 'history');
    const aidRequest = await AidRequestModel.findById(_id);
    if (aidRequest == null) {
      return [];
    }
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

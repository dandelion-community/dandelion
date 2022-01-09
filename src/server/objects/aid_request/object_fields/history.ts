import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { UserModel } from '../../user/UserModel';
import { AidRequestModel } from '../AidRequestModel';
import type {
  AidRequestHistoryEventForGraphQL,
  AidRequestType,
} from '../AidRequestModelTypes';

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
      details: event.details,
      timestamp: event.timestamp,
    }));
  },
  type: '[AidRequestHistoryEvent]',
};

export default history;

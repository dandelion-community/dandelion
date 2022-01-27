import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { ObjectId } from 'mongodb';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import filterNulls from 'src/shared/utils/filterNulls';

const whoIsWorkingOnItUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<Express.User>> => {
    const user = assertLoggedIn(req, 'AidRequest.whoIsWorkingOnItUsers');
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    const { whoIsWorkingOnIt: whoIsWorkingOnItUserIDs } = aidRequest;
    const users = await Promise.all(
      whoIsWorkingOnItUserIDs.map(
        async (userID: ObjectId): Promise<Express.User | null> => {
          return await UserModel.findById(userID);
        },
      ),
    );
    return filterNulls(users);
  },
  type: '[User]',
};

export default whoIsWorkingOnItUsers;

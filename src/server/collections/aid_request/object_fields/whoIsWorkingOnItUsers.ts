import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import filterNulls from 'src/shared/utils/filterNulls';

const whoIsWorkingOnItUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
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

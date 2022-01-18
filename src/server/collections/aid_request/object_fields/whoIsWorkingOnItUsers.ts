import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import filterNulls from 'src/shared/utils/filterNulls';

const whoIsWorkingOnItUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<Express.User>> => {
    assertLoggedIn(req, 'whoIsWorkingOnItUsers');
    const aidRequest = await AidRequestModel.findById(_id);
    if (aidRequest == null) {
      return [];
    }
    const { whoIsWorkingOnIt: whoIsWorkingOnItUserIDs } = aidRequest;
    const users = await Promise.all(
      whoIsWorkingOnItUserIDs.map(
        async (userID: ObjectId): Promise<Express.User | null> => {
          const dbUser = await UserModel.findById(userID);
          if (dbUser == null) {
            return null;
          }
          return dbUser;
        },
      ),
    );
    return filterNulls(users);
  },
  type: '[User]',
};

export default whoIsWorkingOnItUsers;

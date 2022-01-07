import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import filterNulls from '../../../../shared/utils/filterNulls';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { UserModel } from '../../user/UserModel';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

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
        async (userID: string): Promise<Express.User | null> => {
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

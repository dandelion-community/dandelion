import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import filterNulls from '../../../../shared/utils/filterNulls';
import { UserModel } from '../../user/UserModel';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

const whoIsWorkingOnItUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  unknown
> = {
  resolve: async ({
    _id,
  }: Document<string, unknown, AidRequestType>): Promise<
    Array<Express.User>
  > => {
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

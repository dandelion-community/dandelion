import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import filterNulls from '../../../../shared/utils/filterNulls';
import { AidRequestModel } from '../../aid_request/AidRequestModel';
import type { AidRequestType } from '../../aid_request/AidRequestModelTypes';
import { UserModel } from '../UserModel';

const aidRequestsIAmWorkingOn: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Express.User,
  unknown
> = {
  resolve: async ({
    _id,
  }: Express.User): Promise<
    Array<Document<string, unknown, AidRequestType>>
  > => {
    const dbUser = await UserModel.findById(_id);
    if (dbUser == null) {
      return [];
    }
    const aidRequests = await Promise.all(
      (dbUser.aidRequestsIAmWorkingOn ?? []).map((aidRequestID: string) =>
        AidRequestModel.findById(new ObjectId(aidRequestID)),
      ),
    );
    return filterNulls(aidRequests);
  },
  type: '[AidRequest]',
};

export default aidRequestsIAmWorkingOn;

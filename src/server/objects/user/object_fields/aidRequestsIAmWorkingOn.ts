import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import filterNulls from '../../../../shared/utils/filterNulls';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestModel } from '../../aid_request/AidRequestModel';
import type { AidRequestType } from '../../aid_request/AidRequestModelTypes';
import { UserModel } from '../UserModel';

const aidRequestsIAmWorkingOn: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Express.User,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: userID }: Express.User,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<Document<string, unknown, AidRequestType>>> => {
    assertLoggedIn(req, 'aidRequestsIAmWorkingOn');
    const dbUser = await UserModel.findById(userID);
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

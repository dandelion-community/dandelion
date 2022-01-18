import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserModel } from 'src/server/collections/user/UserModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import filterNulls from 'src/shared/utils/filterNulls';

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
      (dbUser.aidRequestsIAmWorkingOn ?? []).map((aidRequestID: ObjectId) =>
        AidRequestModel.findById(aidRequestID),
      ),
    );
    return filterNulls(aidRequests);
  },
  type: '[AidRequest]',
};

export default aidRequestsIAmWorkingOn;

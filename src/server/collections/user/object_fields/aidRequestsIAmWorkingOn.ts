import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import { maybeLoadAidRequestForViewer } from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
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
    const viewer = assertLoggedIn(req, 'aidRequestsIAmWorkingOn');
    const user = await UserModel.findById(userID);
    if (user == null) {
      return [];
    }
    const aidRequests = await Promise.all(
      (user.aidRequestsIAmWorkingOn ?? []).map(
        async (aidRequestID: ObjectId) => {
          return await maybeLoadAidRequestForViewer(
            viewer,
            aidRequestID.toString(),
          );
        },
      ),
    );
    return filterNulls(aidRequests);
  },
  type: '[AidRequest]',
};

export default aidRequestsIAmWorkingOn;

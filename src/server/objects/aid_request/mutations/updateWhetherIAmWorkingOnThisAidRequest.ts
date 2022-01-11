import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

const updateWhetherIAmWorkingOnThisAidRequest = {
  args: {
    aidRequestID: 'String!',
    iAmWorkingOnIt: 'Boolean!',
  },
  resolve: updateWhetherIAmWorkingOnThisAidRequestResolver,
  type: AidRequestGraphQLType,
};

export default updateWhetherIAmWorkingOnThisAidRequest;

async function updateWhetherIAmWorkingOnThisAidRequestResolver(
  _: unknown,
  {
    aidRequestID,
    iAmWorkingOnIt,
  }: { aidRequestID: string; iAmWorkingOnIt: boolean },
  req: Express.Request,
): Promise<AidRequestType | null> {
  const user = assertLoggedIn(
    req,
    'Update whether I am working on this aid request',
  );
  const { _id: userID } = user;
  const history = {
    action: iAmWorkingOnIt ? 'Add' : 'Remove',
    actor: user._id,
    details: { event: 'WorkingOn' },
    timestamp: new Date(),
  };

  await mongoose.connection.db.collection('userInfo').updateOne(
    { _id: new ObjectId(userID) },
    iAmWorkingOnIt
      ? {
          $addToSet: {
            aidRequestsIAmWorkingOn: new ObjectId(aidRequestID),
          },
          $push: { history },
        }
      : {
          $pullAll: { aidRequestsIAmWorkingOn: [new ObjectId(aidRequestID)] },
          $push: { history },
        },
  );
  return await AidRequestModel.findOneAndUpdate(
    { _id: aidRequestID },
    iAmWorkingOnIt
      ? { $addToSet: { whoIsWorkingOnIt: userID } }
      : { $pullAll: { whoIsWorkingOnIt: [userID] } },
    { new: true },
  );
}

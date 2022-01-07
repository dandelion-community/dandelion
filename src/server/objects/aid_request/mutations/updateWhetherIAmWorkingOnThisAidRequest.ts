import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
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
  const { user } = req;
  if (user == null) {
    throw new Error(
      'You must be logged in to add a person who is working on it',
    );
  }
  const { _id: userID } = user;

  await mongoose.connection.db.collection('userInfo').updateOne(
    { _id: new ObjectId(userID) },
    iAmWorkingOnIt
      ? {
          $addToSet: {
            aidRequestsIAmWorkingOn: new ObjectId(aidRequestID),
          },
        }
      : {
          $pullAll: { aidRequestsIAmWorkingOn: [new ObjectId(aidRequestID)] },
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

import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { AidRequestGraphQLType } from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

export const addUserWhoIsWorkingOnAnAidRequest = {
  args: {
    aidRequestID: 'String!',
    userID: 'String!',
  },
  resolve: createResolver('Add'),
  type: AidRequestGraphQLType,
};

export const removeUserWhoIsWorkingOnAnAidRequest = {
  args: {
    aidRequestID: 'String!',
    userID: 'String!',
  },
  resolve: createResolver('Remove'),
  type: AidRequestGraphQLType,
};

type Resolver = (
  _: unknown,
  { aidRequestID, userID }: { aidRequestID: string; userID: string },
  req: Express.Request,
) => Promise<AidRequestType | null>;

function createResolver(addOrRemove: 'Add' | 'Remove'): Resolver {
  async function resolver(
    _: unknown,
    { aidRequestID, userID }: { aidRequestID: string; userID: string },
    req: Express.Request,
  ): Promise<AidRequestType | null> {
    const { user } = req;
    if (user == null) {
      throw new Error(
        'You must be logged in to add a person who is working on it',
      );
    }
    await mongoose.connection.db.collection('userInfo').updateOne(
      { _id: new ObjectId(userID) },
      addOrRemove === 'Add'
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
      addOrRemove === 'Add'
        ? { $addToSet: { whoIsWorkingOnIt: userID } }
        : { $pullAll: { whoIsWorkingOnIt: [userID] } },
      { new: true },
    );
  }
  return resolver;
}

import { ObjectId } from 'mongodb';
import type { UpdateQuery } from 'mongoose';
import mongoose from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import {
  AidRequestActionInputInputType,
  AidRequestGraphQLType,
} from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type {
  AidRequestActionInput,
  AidRequestType,
} from '../AidRequestModelTypes';

async function editAidRequestResolver(
  _: unknown,
  {
    aidRequestID,
    input,
  }: {
    aidRequestID: string;
    input: AidRequestActionInput;
  },
  req: Express.Request,
): Promise<AidRequestType | null> {
  const user = assertLoggedIn(req, 'editAidRequest');
  const updater = await getUpdater(user, aidRequestID, input);
  return await AidRequestModel.findByIdAndUpdate(aidRequestID, updater, {
    new: true,
  });
}

const editAidRequest = {
  args: {
    aidRequestID: 'String!',
    input: AidRequestActionInputInputType,
  },
  resolve: editAidRequestResolver,
  type: AidRequestGraphQLType,
};

export default editAidRequest;

async function getUpdater(
  user: Express.User,
  aidRequestID: string,
  input: AidRequestActionInput,
): Promise<UpdateQuery<AidRequestType>> {
  const { action, details } = input;
  const history = {
    action,
    actor: user._id,
    details,
    timestamp: new Date(),
  };
  switch (details.event) {
    case 'Created':
      throw new Error('Cannot create an aid request through editAidRequest');
    case 'WorkingOn':
      return await (async () => {
        await mongoose.connection.db.collection('userInfo').updateOne(
          { _id: new ObjectId(user._id) },
          action === 'Add'
            ? {
                $addToSet: {
                  aidRequestsIAmWorkingOn: new ObjectId(aidRequestID),
                },
                $push: { history },
              }
            : {
                $pullAll: {
                  aidRequestsIAmWorkingOn: [new ObjectId(aidRequestID)],
                },
                $push: { history },
              },
        );
        switch (action) {
          case 'Add':
            return {
              $addToSet: {
                whoIsWorkingOnIt: user._id,
              },
              $push: { history },
            };
          case 'Remove':
            return {
              $pullAll: {
                whoIsWorkingOnIt: [user._id],
              },
              $push: { history },
            };
        }
      })();
    case 'Completed':
      return {
        $push: {
          history,
        },
        completed: action === 'Add',
      };
  }
}

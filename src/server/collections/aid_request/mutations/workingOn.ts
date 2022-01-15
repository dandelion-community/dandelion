import { ObjectId } from 'mongodb';
import type { UpdateQuery } from 'mongoose';
import mongoose from 'mongoose';
import type {
  AidRequestActionType,
  AidRequestHistoryEvent,
  AidRequestType,
} from '../AidRequestModelTypes';

export default async function getUpdater(
  user: Express.User,
  aidRequestID: string,
  action: AidRequestActionType,
  undoID: string | null,
  historyEvent: Omit<AidRequestHistoryEvent, '_id'>,
): Promise<UpdateQuery<AidRequestType>> {
  const isWorkingOn = (action === 'Add') === (undoID == null);
  await mongoose.connection.db.collection('userInfo').updateOne(
    { _id: new ObjectId(user._id) },
    isWorkingOn
      ? {
          $addToSet: {
            aidRequestsIAmWorkingOn: new ObjectId(aidRequestID),
          },
        }
      : {
          $pullAll: {
            aidRequestsIAmWorkingOn: [new ObjectId(aidRequestID)],
          },
        },
  );
  const historyUpdate =
    undoID == null
      ? { $push: { history: historyEvent } }
      : { $pull: { history: { undoID } } };

  const whoIsWorkingOnItUpdate = isWorkingOn
    ? {
        $addToSet: {
          whoIsWorkingOnIt: user._id,
        },
      }
    : {
        $pullAll: {
          whoIsWorkingOnIt: [user._id],
        },
      };

  return {
    ...historyUpdate,
    ...whoIsWorkingOnItUpdate,
  };
}

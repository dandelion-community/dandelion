import { ObjectId } from 'mongodb';
import {
  AidRequestDeletedModel,
  AidRequestModel,
} from 'src/server/collections/aid_request/AidRequestModel';
import type {
  AidRequestActionType,
  AidRequestHistoryEvent,
} from 'src/server/collections/aid_request/AidRequestModelTypes';

export default async function deleteAidRequest(
  user: Express.User,
  aidRequestID: string,
  historyEvent: AidRequestHistoryEvent,
  action: AidRequestActionType,
  undoID: string | null,
): Promise<void> {
  const aidRequest = await AidRequestModel.findById(aidRequestID);
  if (aidRequest == null) {
    throw new Error('Aid request not found: ' + aidRequestID);
  }
  if (action !== 'Add') {
    throw new Error('Un-deleting not supported');
  }
  if (undoID != null) {
    throw new Error('Undoing deletion not supported');
  }
  if (!new ObjectId(aidRequest.whoRecordedIt).equals(user._id)) {
    throw new Error('Only the person who created a request can delete it');
  }
  const backup = new AidRequestDeletedModel({
    _id: aidRequest._id,
    completed: aidRequest.completed,
    createdAt: aidRequest.createdAt,
    history: [...aidRequest.history, historyEvent],
    whatIsNeeded: aidRequest.whatIsNeeded,
    whoIsItFor: aidRequest.whoIsItFor,
    whoIsWorkingOnIt: aidRequest.whoIsWorkingOnIt,
    whoRecordedIt: aidRequest.whoRecordedIt,
    whoRecordedItUsername: aidRequest.whoRecordedItUsername,
  });
  const backupSaved = await backup.save();
  if (backupSaved == null) {
    throw new Error('Failed to delete');
  }
  await AidRequestModel.findByIdAndDelete(aidRequestID, {
    new: true,
  });
}

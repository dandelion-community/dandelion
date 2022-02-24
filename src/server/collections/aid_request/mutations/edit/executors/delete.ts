import { ObjectId } from 'mongodb';
import {
  AidRequestDeletedModel,
  AidRequestModel,
} from 'src/server/collections/aid_request/AidRequestModel';
import createHistoryEvent from 'src/server/collections/aid_request/mutations/edit/helpers/createHistoryEvent';
import getIsUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';

export default async function delete_(args: UpdateArgs): Promise<UpdateResult> {
  const isAdd = args.input.action === 'Add';
  const isUndo = getIsUndo(args);
  const historyEvent = createHistoryEvent(args, { supportsUndo: false });
  const aidRequest = await AidRequestModel.findById(args.aidRequestID);
  if (aidRequest == null) {
    throw new Error('Aid request not found: ' + args.aidRequestID);
  }
  if (!isAdd) {
    throw new Error('Un-deleting not supported');
  }
  if (isUndo) {
    throw new Error('Undoing deletion not supported');
  }
  if (!new ObjectId(aidRequest.whoRecordedIt).equals(args.user._id)) {
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
  await AidRequestModel.findByIdAndDelete(args.aidRequestID, {
    new: true,
  });

  const postpublishSummary = 'Deleted';

  return { aidRequest: null, historyEvent, postpublishSummary };
}

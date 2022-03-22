import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import createHistoryEvent from 'src/server/collections/aid_request/mutations/edit/helpers/createHistoryEvent';
import getHistoryUpdate from 'src/server/collections/aid_request/mutations/edit/helpers/getHistoryUpdate';
import getIsUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import updateAidRequest from 'src/server/collections/aid_request/mutations/edit/helpers/updateAidRequest';
import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';
import { AidRequestReminderModel } from 'src/server/collections/aid_request_reminder/AidRequestReminderModel';
import REMINDER_DAYS from 'src/server/collections/aid_request_reminder/REMINDER_DAYS';
import afterRequestIsComplete from 'src/server/utils/afterRequestIsComplete';
import addDays from 'src/shared/utils/date/addDays';

export default async function workingOn(
  args: UpdateArgs,
): Promise<UpdateResult> {
  const isAdd = args.input.action === 'Add';
  const isUndo = getIsUndo(args);
  const isWorkingOn = isAdd !== isUndo;
  await updateUserInfoObject(args, isWorkingOn);

  const historyEvent = createHistoryEvent(args, { supportsUndo: true });
  const historyUpdate = getHistoryUpdate(args, historyEvent);

  const userID = args.user._id;
  const whoIsWorkingOnItUpdate = isWorkingOn
    ? {
        $addToSet: {
          whoIsWorkingOnIt: userID,
        },
      }
    : {
        $pullAll: {
          whoIsWorkingOnIt: [userID],
        },
      };

  const aidRequest = await updateAidRequest(args.aidRequestID, {
    ...historyUpdate,
    ...whoIsWorkingOnItUpdate,
  });

  const postpublishSummary = isAdd
    ? "You're working on this"
    : "You're not working on this";

  afterRequestIsComplete(args.req, () =>
    updateReminder({
      aidRequestID: new ObjectId(args.aidRequestID),
      isWorkingOn,
      userID,
    }),
  );

  return { aidRequest, historyEvent, postpublishSummary };
}

async function updateUserInfoObject(
  args: UpdateArgs,
  isWorkingOn: boolean,
): Promise<void> {
  const aidRequestIDObj = new ObjectId(args.aidRequestID);
  await mongoose.connection.db.collection('userInfo').updateOne(
    { _id: new ObjectId(args.user._id) },
    isWorkingOn
      ? {
          $addToSet: {
            aidRequestsIAmWorkingOn: aidRequestIDObj,
          },
        }
      : {
          $pullAll: {
            aidRequestsIAmWorkingOn: [aidRequestIDObj],
          },
        },
  );
}

type UpdateReminderArgs = {
  isWorkingOn: boolean;
  aidRequestID: ObjectId;
  userID: ObjectId;
};

async function updateReminder({
  aidRequestID,
  isWorkingOn,
  userID,
}: UpdateReminderArgs): Promise<void> {
  const existingReminder = await AidRequestReminderModel.findOne({
    aidRequestID,
    userID,
  });
  if (isWorkingOn && existingReminder == null) {
    await new AidRequestReminderModel({
      aidRequestID,
      howManyDays: REMINDER_DAYS,
      scheduledFor: addDays(new Date(), REMINDER_DAYS),
      sent: false,
      userID,
    }).save();
  } else if (!isWorkingOn && existingReminder != null) {
    await AidRequestReminderModel.findByIdAndDelete(existingReminder._id);
  }
}

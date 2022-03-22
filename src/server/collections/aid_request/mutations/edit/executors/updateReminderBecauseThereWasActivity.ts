import { ObjectId } from 'mongodb';
import { AidRequestReminderModel } from 'src/server/collections/aid_request_reminder/AidRequestReminderModel';
import REMINDER_DAYS from 'src/server/collections/aid_request_reminder/REMINDER_DAYS';
import addDays from 'src/shared/utils/date/addDays';

export default async function updateReminderBecauseThereWasActivity({
  aidRequestID,
  userID,
}: {
  aidRequestID: ObjectId;
  userID: ObjectId;
}): Promise<void> {
  await AidRequestReminderModel.findOneAndUpdate(
    {
      aidRequestID,
      userID,
    },
    {
      scheduledFor: addDays(new Date(), REMINDER_DAYS),
    },
  );
}

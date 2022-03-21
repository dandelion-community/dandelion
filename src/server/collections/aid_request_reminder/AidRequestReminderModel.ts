import { model, Schema } from 'mongoose';
import { AidRequestReference } from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserReference } from 'src/server/collections/user/UserModelTypes';
import { AidRequestReminderType } from './AidRequestReminderModelTypes';

const AidRequestReminderSchema = new Schema<AidRequestReminderType>({
  aidRequestID: AidRequestReference,
  howManyDays: Number,
  scheduledFor: Date,
  userID: UserReference,
});

export const AidRequestReminderModel = model<AidRequestReminderType>(
  'AidRequestReminder',
  AidRequestReminderSchema,
);

export const AidRequestReminderDeletedModel = model<AidRequestReminderType>(
  'AidRequestReminderDeleted',
  AidRequestReminderSchema,
);

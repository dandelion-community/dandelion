import type { ObjectId } from 'mongodb';

export type AidRequestReminderType = {
  _id: string;
  aidRequestID: ObjectId;
  scheduledFor: Date;
  sent: boolean;
  userID: ObjectId;
};

import type { ObjectId } from 'mongodb';

export type AidRequestReminderType = {
  _id: string;
  aidRequestID: ObjectId;
  howManyDays: number;
  scheduledFor: Date;
  userID: ObjectId;
};

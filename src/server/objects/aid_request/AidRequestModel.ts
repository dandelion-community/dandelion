import { model, Schema } from 'mongoose';
import type { AidRequestType } from './AidRequestModelTypes';

const AidRequestSchema = new Schema<AidRequestType>({
  completed: Boolean,
  createdAt: Date,
  whatIsNeeded: String,
  whoIsItFor: String,
  whoIsWorkingOnIt: [String],
  whoRecordedItUsername: String,
});

export const AidRequestModel = model<AidRequestType>(
  'AidRequest',
  AidRequestSchema,
);

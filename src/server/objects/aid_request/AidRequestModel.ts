import { model, Schema } from 'mongoose';
import { UserReference } from '../user/UserModelTypes';
import type {
  AidRequestHistoryEvent,
  AidRequestHistoryEventPayload,
  AidRequestType,
} from './AidRequestModelTypes';

const AidRequestHistoryEventPayloadSchema =
  new Schema<AidRequestHistoryEventPayload>({
    event: {
      enum: ['Completed', 'WorkingOn'],
      type: String,
    },
  });

const AidRequestHistoryEventSchema = new Schema<AidRequestHistoryEvent>({
  action: { enum: ['Add', 'Remove'], type: String },
  actor: UserReference,
  details: AidRequestHistoryEventPayloadSchema,
  timestamp: Date,
});

const AidRequestSchema = new Schema<AidRequestType>({
  completed: Boolean,
  createdAt: Date,
  history: [AidRequestHistoryEventSchema],
  whatIsNeeded: String,
  whoIsItFor: String,
  whoIsWorkingOnIt: [String],
  whoRecordedIt: String,
  whoRecordedItUsername: String,
});

export const AidRequestModel = model<AidRequestType>(
  'AidRequest',
  AidRequestSchema,
);

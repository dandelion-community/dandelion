import { model, Schema } from 'mongoose';
import type {
  AidRequestHistoryEvent,
  AidRequestHistoryEventPayload,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserReference } from 'src/server/collections/user/UserModelTypes';

const AidRequestHistoryEventPayloadSchema =
  new Schema<AidRequestHistoryEventPayload>({
    event: {
      enum: ['Completed', 'Created', 'WorkingOn', 'Deleted'],
      type: String,
    },
  });

const AidRequestHistoryEventSchema = new Schema<AidRequestHistoryEvent>({
  action: { enum: ['Add', 'Remove'], type: String },
  actor: UserReference,
  details: AidRequestHistoryEventPayloadSchema,
  timestamp: Date,
  undoID: String,
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

export const AidRequestDeletedModel = model<AidRequestType>(
  'AidRequestDeleted',
  AidRequestSchema,
);

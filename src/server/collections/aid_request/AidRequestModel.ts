import { model, Schema } from 'mongoose';
import type {
  AidRequestHistoryEvent,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserReference } from 'src/server/collections/user/UserModelTypes';

const AidRequestHistoryEventSchema = new Schema<AidRequestHistoryEvent>({
  action: { enum: ['Add', 'Remove'], type: String },
  actor: UserReference,
  event: {
    enum: [
      'ChangedWhatIsNeeded',
      'ChangedWhoIsItFor',
      'Comment',
      'Completed',
      'Created',
      'Deleted',
      'WorkingOn',
    ],
    type: String,
  },
  eventSpecificData: String,
  newValue: String,
  oldValue: String,
  timestamp: Date,
  undoID: String,
});

const AidRequestSchema = new Schema<AidRequestType>({
  completed: Boolean,
  createdAt: Date,
  crew: String,
  history: [AidRequestHistoryEventSchema],
  lastUpdated: Date,
  whatIsNeeded: String,
  whatIsNeededSearch: String,
  whoIsItFor: String,
  whoIsItForSearch: String,
  whoIsWorkingOnIt: [String],
  whoIsWorkingOnItSearch: String,
  whoRecordedIt: String,
  whoRecordedItSearch: String,
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

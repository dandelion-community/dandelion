import type { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export type AidRequestHistoryEventType =
  | 'ChangedWhoIsItFor'
  | 'ChangedWhatIsNeeded'
  | 'Comment'
  | 'Completed'
  | 'Created'
  | 'Deleted'
  | 'WorkingOn';

export type AidRequestActionType = 'Add' | 'Remove';

export type AidRequestHistoryEvent = {
  action: AidRequestActionType;
  actor: ObjectId;
  event: AidRequestHistoryEventType;
  eventSpecificData?: string | undefined;
  newValue?: string | undefined;
  oldValue?: string | undefined;
  timestamp: Date;
  undoID?: string | null | undefined;
};

export type AidRequestActionInput = {
  action: AidRequestActionType;
  event: AidRequestHistoryEventType;
  eventSpecificData?: string | undefined;
};

export type AidRequestActionOption = {
  icon: string | null;
  input: AidRequestActionInput;
  message: string;
};

export type AidRequestHistoryEventForGraphQL = {
  action: AidRequestActionType;
  actor: () => Promise<Express.User | null>;
  aidRequest: () => Promise<AidRequestType | null>;
  event: AidRequestHistoryEventType;
  eventSpecificData?: string | undefined;
  postpublishSummary: string;
  timestamp: Date;
  undoID?: string | null | undefined;
};

export type AidRequestType = {
  _id: string;
  completed: boolean;
  createdAt: Date;
  crew: string;
  history: AidRequestHistoryEvent[];
  lastUpdated: Date;
  whatIsNeeded: string;
  whatIsNeededSearch: string;
  whoIsItFor: string;
  whoIsItForSearch: string;
  whoIsWorkingOnIt: ObjectId[];
  whoIsWorkingOnItSearch: string;
  whoRecordedIt: ObjectId;
  whoRecordedItSearch: string;
  whoRecordedItUsername: string;
};

export const AidRequestReference = {
  ref: 'AidRequest',
  type: Schema.Types.ObjectId,
};

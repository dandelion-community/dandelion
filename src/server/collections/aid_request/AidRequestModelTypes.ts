import type { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export type AidRequestHistoryEventPayload =
  | {
      event: 'Completed';
    }
  | {
      event: 'WorkingOn';
    }
  | {
      event: 'Created';
    }
  | {
      event: 'Deleted';
    };

export type AidRequestActionType = 'Add' | 'Remove';

export type AidRequestHistoryEvent = {
  action: AidRequestActionType;
  actor: ObjectId;
  details: AidRequestHistoryEventPayload;
  timestamp: Date;
  undoID: string | null;
};

export type AidRequestActionInput = {
  action: AidRequestActionType;
  details: AidRequestHistoryEventPayload;
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
  details: AidRequestHistoryEventPayload;
  postpublishSummary: string;
  timestamp: Date;
  undoID: string | null;
};

export type AidRequestType = {
  completed: boolean;
  createdAt: Date;
  history: AidRequestHistoryEvent[];
  whatIsNeeded: string;
  whoIsItFor: string;
  whoIsWorkingOnIt: ObjectId[];
  whoRecordedIt: ObjectId;
  whoRecordedItUsername: string;
  _id: string;
};

export const AidRequestReference = {
  ref: 'AidRequest',
  type: Schema.Types.ObjectId,
};

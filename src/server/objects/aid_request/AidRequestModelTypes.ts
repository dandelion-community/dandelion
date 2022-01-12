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
    };

export type AidRequestActionType = 'Add' | 'Remove';

export type AidRequestHistoryEvent = {
  timestamp: Date;
  actor: ObjectId;
  details: AidRequestHistoryEventPayload;
  action: AidRequestActionType;
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
  timestamp: Date;
  actor: () => Promise<Express.User | null>;
  details: AidRequestHistoryEventPayload;
  action: AidRequestActionType;
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

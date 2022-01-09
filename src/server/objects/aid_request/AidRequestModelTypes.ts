import type { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export type AidRequestHistoryEventPayload =
  | {
      event: 'Completed';
    }
  | {
      event: 'WorkingOn';
    };

export type AidRequestHistoryEvent = {
  timestamp: Date;
  actor: ObjectId;
  details: AidRequestHistoryEventPayload;
  action: 'Add' | 'Remove';
};

export type AidRequestHistoryEventForGraphQL = {
  timestamp: Date;
  actor: () => Promise<Express.User | null>;
  details: AidRequestHistoryEventPayload;
  action: 'Add' | 'Remove';
};

export type AidRequestType = {
  completed: boolean;
  createdAt: Date;
  history: AidRequestHistoryEvent[];
  whatIsNeeded: string;
  whoIsItFor: string;
  whoIsWorkingOnIt: ObjectId[];
  whoRecordedItUsername: string;
  _id: string;
};

export const AidRequestReference = {
  ref: 'AidRequest',
  type: Schema.Types.ObjectId,
};

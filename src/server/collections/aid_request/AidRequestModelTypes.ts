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
  undoID?: string | null | undefined;
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
  undoID?: string | null | undefined;
};

export type AidRequestType = {
  _id: string;
  completed: boolean;
  createdAt: Date;
  crew: string;
  history: AidRequestHistoryEvent[];
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

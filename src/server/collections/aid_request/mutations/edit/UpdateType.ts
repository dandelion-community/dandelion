import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type {
  AidRequestActionInput,
  AidRequestHistoryEvent,
} from 'src/server/collections/aid_request/AidRequestModelTypes';

export type UpdateResult = {
  aidRequest: AidRequest | null;
  postpublishSummary: string;
  historyEvent: AidRequestHistoryEvent;
};

export type UpdateArgs = {
  user: Express.User;
  aidRequestID: string;
  input: AidRequestActionInput;
  undoID: string | null;
};

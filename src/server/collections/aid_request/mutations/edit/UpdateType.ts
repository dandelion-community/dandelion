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
  aidRequestID: string;
  input: AidRequestActionInput;
  originalAidRequest: AidRequest;
  undoID: string | null;
  user: Express.User;
};

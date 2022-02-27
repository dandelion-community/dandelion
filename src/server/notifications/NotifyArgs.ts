import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type { AidRequestHistoryEvent } from '../collections/aid_request/AidRequestModelTypes';

export type NotifyArgs = {
  aidRequest: AidRequest;
  comment: AidRequestHistoryEvent;
  commenter: Express.User;
  type: 'NewComment';
  req: Express.Request;
};

export type NotifySpecificRecipientArgs = NotifyArgs & {
  recipient: Express.User;
};

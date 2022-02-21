import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type { AidRequestHistoryEvent } from '../collections/aid_request/AidRequestModelTypes';

export type NewCommentNotification = {
  aidRequest: AidRequest;
  comment: AidRequestHistoryEvent;
  commenter: Express.User;
  recipient: Express.User;
  type: 'NEW_COMMENT';
};

export type Notification = NewCommentNotification;

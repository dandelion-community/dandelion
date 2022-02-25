import sendNotificationsAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/sendNotificationsAboutNewCommentOnAidRequest';
import type { Notification } from 'src/server/notifications/NotificationTypes';

export default async function notify(
  notification: Notification,
): Promise<void> {
  switch (notification.type) {
    case 'NEW_COMMENT':
      return await sendNotificationsAboutNewCommentOnAidRequest(notification);
  }
}

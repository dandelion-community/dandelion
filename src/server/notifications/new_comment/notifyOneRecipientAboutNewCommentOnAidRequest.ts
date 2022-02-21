import email from 'src/server/email';
import type { NewCommentNotification } from 'src/server/notifications/NotificationTypes';

export default async function notifyOneRecipientAboutNewCommentOnAidRequest(
  notification: NewCommentNotification,
): Promise<void> {
  await email.sendNewCommentEmail(notification);
}

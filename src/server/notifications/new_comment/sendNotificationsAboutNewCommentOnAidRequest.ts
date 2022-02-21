import getAllNotificationRecipients from 'src/server/notifications/getAllNotificationRecipients';
import notifyOneRecipientAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/notifyOneRecipientAboutNewCommentOnAidRequest';
import { NewCommentNotification } from 'src/server/notifications/NotificationTypes';

export default async function sendNotificationsAboutNewCommentOnAidRequest({
  aidRequest,
  comment,
  commenter,
  type,
}: Omit<NewCommentNotification, 'recipient'>): Promise<void> {
  const recipients = await getAllNotificationRecipients({
    actor: commenter,
    aidRequest,
  });
  await Promise.all(
    recipients.map(async (recipient) => {
      await notifyOneRecipientAboutNewCommentOnAidRequest({
        aidRequest,
        comment,
        commenter,
        recipient,
        type,
      });
    }),
  );
}

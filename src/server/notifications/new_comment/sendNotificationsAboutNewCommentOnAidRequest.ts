import getAllNotificationRecipients from 'src/server/notifications/helpers/getAllNotificationRecipients';
import notifyOneRecipientAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/notifyOneRecipientAboutNewCommentOnAidRequest';
import { NotifyArgs } from 'src/server/notifications/NotifyArgs';

export default async function sendNotificationsAboutNewCommentOnAidRequest({
  aidRequest,
  commenter,
  ...rest
}: NotifyArgs): Promise<void> {
  const recipients = await getAllNotificationRecipients({
    actor: commenter,
    aidRequest,
  });
  await Promise.all(
    recipients.map(async (recipient) => {
      await notifyOneRecipientAboutNewCommentOnAidRequest({
        aidRequest,
        commenter,
        recipient,
        ...rest,
      });
    }),
  );
}

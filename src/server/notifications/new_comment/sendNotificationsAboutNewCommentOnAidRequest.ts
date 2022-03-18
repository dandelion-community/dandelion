import getAllNotificationRecipients from 'src/server/notifications/helpers/getAllNotificationRecipients';
import getTaggedIDs from 'src/server/notifications/helpers/getTaggedIDs';
import notifyOneRecipientAboutNewCommentOnAidRequest from 'src/server/notifications/new_comment/notifyOneRecipientAboutNewCommentOnAidRequest';
import { NotifyArgs } from 'src/server/notifications/NotifyArgs';

export default async function sendNotificationsAboutNewCommentOnAidRequest({
  aidRequest,
  commenter,
  comment,
  ...rest
}: NotifyArgs): Promise<void> {
  const extraRecipientIDs = getTaggedIDs(comment.eventSpecificData ?? '');
  const recipients = await getAllNotificationRecipients({
    actor: commenter,
    aidRequest,
    extraRecipientIDs,
  });
  await Promise.all(
    recipients.map(async (recipient) => {
      await notifyOneRecipientAboutNewCommentOnAidRequest({
        aidRequest,
        comment,
        commenter,
        extraRecipientIDs,
        recipient,
        ...rest,
      });
    }),
  );
}

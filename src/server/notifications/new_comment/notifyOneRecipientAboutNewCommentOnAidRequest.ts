import email from 'src/server/email';
import { NotifySpecificRecipientArgs } from 'src/server/notifications/NotifyArgs';
import checkNotificationSettingsAndMaybeNotify from '../helpers/checkNotificationSettingsAndMaybeNotify';

export default async function notifyOneRecipientAboutNewCommentOnAidRequest(
  args: NotifySpecificRecipientArgs,
): Promise<void> {
  await checkNotificationSettingsAndMaybeNotify({
    args,
    notifiableEvent: 'NewComment',
    notificationMethod: 'Email',
    notify: async () => await email.sendNewCommentEmail(args),
  });
}

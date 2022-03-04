import sendEmail from 'src/server/email/sendEmail';
import { NotifySpecificRecipientArgs } from 'src/server/notifications/NotifyArgs';
import aidRequestDetailUrl from 'src/shared/urls/aidRequestDetailUrl';
import aidRequestNotificationSettingsUrl from 'src/shared/urls/aidRequestNotificationSettingsUrl';
import checkNotificationSettingsAndMaybeNotify from '../helpers/checkNotificationSettingsAndMaybeNotify';

export default async function notifyOneRecipientAboutNewCommentOnAidRequest(
  args: NotifySpecificRecipientArgs,
): Promise<void> {
  const { aidRequest, comment, commenter, recipient } = args;
  const aidRequestID = args.aidRequest._id.toString();
  await checkNotificationSettingsAndMaybeNotify({
    args,
    notifiableEvent: 'NewComment',
    notificationMethod: 'Email',
    notify: async () =>
      await sendEmail({
        recipient,
        templateID: 'NEW_COMMENT_NOTIFICATION_TEMPLATE_ID',
        templateProps: {
          comment_value: comment.eventSpecificData ?? 'Unknown',
          commenter_name: commenter.displayName,
          notification_settings_url:
            aidRequestNotificationSettingsUrl(aidRequestID),
          request_url: aidRequestDetailUrl(aidRequestID),
          what_is_needed: aidRequest.whatIsNeeded,
          who_is_it_for: aidRequest.whoIsItFor,
        },
      }),
  });
}

import analytics from 'src/server/analytics';
import { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NotificationMethod } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import getAidRequestNotificationSettings from 'src/server/collections/aid_request_notification_settings/helpers/getAidRequestNotificationSettings';
import getCurrentSettingForNotificationOnAidRequest from 'src/server/collections/aid_request_notification_settings/helpers/getCurrentSettingForNotificationOnAidRequest';
import { NotifySpecificRecipientArgs } from 'src/server/notifications/NotifyArgs';

type Args = {
  args: NotifySpecificRecipientArgs;
  notify: () => Promise<void>;
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
};

export default async function checkNotificationSettingsAndMaybeNotify({
  args,
  notify,
  notifiableEvent,
  notificationMethod,
}: Args): Promise<void> {
  const notificationSettings = await getAidRequestNotificationSettings(
    args.recipient,
    args.aidRequest._id.toString(),
  );
  const { subscribeOrUnsubscribe, reason } =
    await getCurrentSettingForNotificationOnAidRequest({
      notifiableEvent,
      notificationMethod,
      notificationSettings,
    });

  const shouldNotify = subscribeOrUnsubscribe === 'Subscribe';

  analytics.track({
    event: `${shouldNotify ? 'Sending' : 'Not sending'} notification`,
    properties: {
      aidRequestID: args.aidRequest._id.toString(),
      notifiableEvent,
      notificationMethod,
      reason,
    },
    user: args.recipient,
  });

  if (shouldNotify) {
    await notify();
  }
}

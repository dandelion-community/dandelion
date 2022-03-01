import AidRequestNotificationsConfig from 'src/server/collections/aid_request_notification_settings/config/AidRequestNotificationsConfig';
import { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import { NotificationMethod } from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { SubscribeOrUnsubscribe } from 'src/server/collections/aid_request_notification_settings/enums/SubscribeOrUnsubscribe';

type Args = {
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
};

export default function getDefaultNotificationSetting({
  notifiableEvent,
  notificationMethod,
}: Args): SubscribeOrUnsubscribe {
  return AidRequestNotificationsConfig[notifiableEvent].notificationMethods[
    notificationMethod
  ].defaultValue;
}

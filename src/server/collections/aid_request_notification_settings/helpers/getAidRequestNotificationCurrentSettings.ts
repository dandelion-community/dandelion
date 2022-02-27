import { AidRequestNotificationSettings } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModel';
import { NotifiableEventOnAidRequest } from 'src/server/collections/aid_request_notification_settings/enums/NotifiableEventOnAidRequest';
import {
  ALL_NOTIFICATION_METHODS,
  NotificationMethod,
} from 'src/server/collections/aid_request_notification_settings/enums/NotificationMethod';
import { AidRequestNotificationCurrentSettingForGraphQL } from '../AidRequestNotificationSettingsModelTypes';
import { ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS } from '../enums/NotifiableEventOnAidRequest';
import getCurrentSettingForNotificationOnAidRequest from './getCurrentSettingForNotificationOnAidRequest';

export default async function getAidRequestNotificationCurrentSettings(
  notificationSettings: AidRequestNotificationSettings,
): Promise<AidRequestNotificationCurrentSettingForGraphQL[]> {
  const currentSettings: Promise<AidRequestNotificationCurrentSettingForGraphQL>[] =
    [];
  ALL_NOTIFICATION_METHODS.forEach(
    (notificationMethod: NotificationMethod): void => {
      ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS.forEach(
        (notifiableEvent: NotifiableEventOnAidRequest): void => {
          currentSettings.push(
            getCurrentSettingForNotificationOnAidRequest({
              notifiableEvent,
              notificationMethod,
              notificationSettings,
            }),
          );
        },
      );
    },
  );
  return await Promise.all(currentSettings);
}

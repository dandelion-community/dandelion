import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { AidRequestNotificationSettings } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModel';
import { AidRequestNotificationSettingsTypeForGraphQL } from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModelTypes';
import getAidRequestNotificationCurrentSettings from 'src/server/collections/aid_request_notification_settings/helpers/getAidRequestNotificationCurrentSettings';
import graphqlifyAidRequestChangeNotificationSettingHistoryEvent from 'src/server/collections/aid_request_notification_settings/helpers/graphqlifyAidRequestChangeNotificationSettingHistoryEvent';

export default function graphqlifyAidRequestNotificationSettings(
  user: Express.User,
  notificationSettings: AidRequestNotificationSettings,
): AidRequestNotificationSettingsTypeForGraphQL {
  const aidRequestID = notificationSettings.aidRequestID.toString();
  return {
    _id: notificationSettings._id.toString(),
    aidRequest: async () => await loadAidRequestForViewer(user, aidRequestID),
    history: notificationSettings.history.map((event) =>
      graphqlifyAidRequestChangeNotificationSettingHistoryEvent({
        event,
        notificationSettings,
        user,
      }),
    ),
    settings: async () =>
      await getAidRequestNotificationCurrentSettings(notificationSettings),
    user: async () => user,
  };
}

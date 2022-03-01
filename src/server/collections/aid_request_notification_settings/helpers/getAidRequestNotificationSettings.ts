import {
  AidRequestNotificationSettings,
  AidRequestNotificationSettingsModel,
} from 'src/server/collections/aid_request_notification_settings/AidRequestNotificationSettingsModel';

export default async function getAidRequestNotificationSettings(
  user: Express.User,
  aidRequestID: string,
): Promise<AidRequestNotificationSettings> {
  let notificationSettings: null | AidRequestNotificationSettings =
    await AidRequestNotificationSettingsModel.findOne({
      aidRequestID,
      userID: user._id,
    });

  if (notificationSettings == null) {
    notificationSettings = new AidRequestNotificationSettingsModel({
      aidRequestID,
      history: [],
      userID: user._id,
    });
    notificationSettings = await notificationSettings.save();
  }

  if (notificationSettings == null) {
    throw new Error('Unable to get or create notification settings');
  }

  return notificationSettings;
}

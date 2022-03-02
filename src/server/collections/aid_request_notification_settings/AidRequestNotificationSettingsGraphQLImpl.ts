import editNotificationSetting from 'src/server/collections/aid_request_notification_settings/mutations/editNotificationSetting';
import aidRequestNotificationSettings from 'src/server/collections/aid_request_notification_settings/query_fields/aidRequestNotificationSettings';

const AidRequestNotificationSettings = {
  MutationFields: {
    editNotificationSetting,
  },
  QueryFields: {
    aidRequestNotificationSettings,
  },
};

export default AidRequestNotificationSettings;

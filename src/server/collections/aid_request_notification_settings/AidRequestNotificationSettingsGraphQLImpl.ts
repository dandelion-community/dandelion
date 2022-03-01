import editSubscriptionSetting from 'src/server/collections/aid_request_notification_settings/mutations/editNotificationSetting';
import aidRequestNotificationSettings from 'src/server/collections/aid_request_notification_settings/query_fields/aidRequestNotificationSettings';

const AidRequestNotificationSettings = {
  MutationFields: {
    editSubscriptionSetting,
  },
  QueryFields: {
    aidRequestNotificationSettings,
  },
};

export default AidRequestNotificationSettings;

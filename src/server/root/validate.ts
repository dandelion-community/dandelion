import * as AidRequestNotificationsConfig from 'src/server/collections/aid_request_notification_settings/config/AidRequestNotificationsConfig';
import validateEmailTemplateIDs from 'src/server/email/validateEmailTemplateIDs';

export default function validate(): void {
  AidRequestNotificationsConfig.validate();
  validateEmailTemplateIDs();
}

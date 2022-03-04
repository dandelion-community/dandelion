import AID_REQUEST_DETAIL_ID_URL_PARAM from './AID_REQUEST_DETAIL_ID_URL_PARAM';
import AID_REQUEST_NOTIFICATION_SETTINGS_PATH from './AID_REQUEST_NOTIFICATION_SETTINGS_PATH';
import getDomainAndProtocol from './getDomainAndProtocol';

export default function aidRequestNotificationSettingsUrl(
  aidRequestID: string,
): string {
  return `${getDomainAndProtocol()}/${AID_REQUEST_NOTIFICATION_SETTINGS_PATH}?${AID_REQUEST_DETAIL_ID_URL_PARAM}=${aidRequestID}`;
}

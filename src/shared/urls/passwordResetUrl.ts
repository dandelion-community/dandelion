import getDomainAndProtocol from './getDomainAndProtocol';
import PASSWORD_RESET_PATH from './PASSWORD_RESET_PATH';
import TOKEN_URL_PARAM from './TOKEN_URL_PARAM';

export default function aidRequestNotificationSettingsUrl(
  token: string,
): string {
  return `${getDomainAndProtocol()}/${PASSWORD_RESET_PATH}?${TOKEN_URL_PARAM}=${token}`;
}

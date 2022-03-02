import { gql } from '@apollo/client';
import { AidRequestNotificationSettingsFragment } from './AidRequestNotificationSettingsFragment';

export const CHANGE_NOTIFICATION_SETTINGS_MUTATION = gql`
  mutation AidRequestEditNotificationSettings(
    $aidRequestID: String!
    $input: AidRequestEditNotificationSettingsInput!
  ) {
    payload: editNotificationSetting(
      aidRequestID: $aidRequestID
      input: $input
    ) {
      settings {
        ...AidRequestNotificationSettingsFragment
      }
    }
  }
  ${AidRequestNotificationSettingsFragment}
`;

import { gql } from '@apollo/client';

export const AidRequestNotificationSettingsFragment = gql`
  fragment AidRequestNotificationSettingsFragment on AidRequestNotificationSettings {
    _id
    settings {
      onlyIfSubscribedToRequest
      notifiableEvent
      notificationMethod
      subscribeOrUnsubscribe
      reason
      title
    }
  }
`;

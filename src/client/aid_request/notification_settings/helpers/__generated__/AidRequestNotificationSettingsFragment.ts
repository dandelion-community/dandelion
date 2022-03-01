/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NotifiableEventOnAidRequest, NotificationMethod, SubscribeOrUnsubscribe } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: AidRequestNotificationSettingsFragment
// ====================================================

export interface AidRequestNotificationSettingsFragment_settings {
  __typename: "AidRequestNotificationCurrentSetting";
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
  reason: string;
  title: string;
}

export interface AidRequestNotificationSettingsFragment {
  __typename: "AidRequestNotificationSettings";
  settings: AidRequestNotificationSettingsFragment_settings[];
}

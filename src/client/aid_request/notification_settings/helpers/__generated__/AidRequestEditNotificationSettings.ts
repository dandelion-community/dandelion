/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestEditNotificationSettingsInput, NotifiableEventOnAidRequest, NotificationMethod, SubscribeOrUnsubscribe } from "./../../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AidRequestEditNotificationSettings
// ====================================================

export interface AidRequestEditNotificationSettings_payload_settings_settings {
  __typename: "AidRequestNotificationCurrentSetting";
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
  reason: string;
  title: string;
}

export interface AidRequestEditNotificationSettings_payload_settings {
  __typename: "AidRequestNotificationSettings";
  settings: AidRequestEditNotificationSettings_payload_settings_settings[];
}

export interface AidRequestEditNotificationSettings_payload {
  __typename: "AidRequestChangeNotificationSettingsEvent";
  settings: AidRequestEditNotificationSettings_payload_settings;
}

export interface AidRequestEditNotificationSettings {
  payload: AidRequestEditNotificationSettings_payload | null;
}

export interface AidRequestEditNotificationSettingsVariables {
  aidRequestID: string;
  input: AidRequestEditNotificationSettingsInput;
}

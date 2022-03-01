/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateActionType, AidRequestHistoryEventType, NotifiableEventOnAidRequest, NotificationMethod, SubscribeOrUnsubscribe } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: AidRequestNotificationSettingsQuery
// ====================================================

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_actionsAvailable_input;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest {
  __typename: "AidRequest";
  _id: string;
  crew: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest_actionsAvailable | null)[] | null;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_settings {
  __typename: "AidRequestNotificationCurrentSetting";
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
  reason: string;
}

export interface AidRequestNotificationSettingsQuery_aidRequestNotificationSettings {
  __typename: "AidRequestNotificationSettings";
  aidRequest: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_aidRequest;
  settings: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings_settings[];
}

export interface AidRequestNotificationSettingsQuery {
  aidRequestNotificationSettings: AidRequestNotificationSettingsQuery_aidRequestNotificationSettings;
}

export interface AidRequestNotificationSettingsQueryVariables {
  aidRequestID: string;
}

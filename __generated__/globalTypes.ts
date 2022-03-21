/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AidRequestHistoryEventType {
  ChangedWhatIsNeeded = "ChangedWhatIsNeeded",
  ChangedWhoIsItFor = "ChangedWhoIsItFor",
  Comment = "Comment",
  Completed = "Completed",
  Created = "Created",
  Deleted = "Deleted",
  WorkingOn = "WorkingOn",
}

export enum AidRequestUpdateActionType {
  Add = "Add",
  Remove = "Remove",
}

export enum NotifiableEventOnAidRequest {
  Any = "Any",
  NewComment = "NewComment",
  YouWereMentionedInAComment = "YouWereMentionedInAComment",
}

export enum NotificationMethod {
  Email = "Email",
}

export enum SubscribeOrUnsubscribe {
  Subscribe = "Subscribe",
  Unsubscribe = "Unsubscribe",
}

export interface AidRequestActionInputInput {
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
  eventSpecificData?: string | null;
}

export interface AidRequestEditNotificationSettingsInput {
  notifiableEvent: NotifiableEventOnAidRequest;
  notificationMethod: NotificationMethod;
  subscribeOrUnsubscribe: SubscribeOrUnsubscribe;
}

export interface AidRequestFilterInput {
  completed?: boolean | null;
  iAmWorkingOnIt?: boolean | null;
  search?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

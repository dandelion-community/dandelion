/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AidRequestUpdateActionType {
  Add = "Add",
  Remove = "Remove",
}

export enum AidRequestUpdateStatusType {
  Completed = "Completed",
  Created = "Created",
  Deleted = "Deleted",
  WorkingOn = "WorkingOn",
}

export interface AidRequestActionInputInput {
  action: AidRequestUpdateActionType;
  details: AidRequestHistoryEventPayloadInput;
}

export interface AidRequestFilterInput {
  completed?: boolean | null;
  iAmWorkingOnIt?: boolean | null;
  search?: string | null;
}

export interface AidRequestHistoryEventPayloadInput {
  event: AidRequestUpdateStatusType;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

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

export interface AidRequestActionInputInput {
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
  eventSpecificData?: string | null;
}

export interface AidRequestFilterInput {
  completed?: boolean | null;
  iAmWorkingOnIt?: boolean | null;
  search?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

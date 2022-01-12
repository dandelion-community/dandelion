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
  WorkingOn = "WorkingOn",
}

export enum EnumAidRequestHistoryAction {
  Add = "Add",
  Remove = "Remove",
}

export enum EnumAidRequestHistoryDetailsEvent {
  Completed = "Completed",
  Created = "Created",
  WorkingOn = "WorkingOn",
}

export interface AidRequestActionInputInput {
  action: AidRequestUpdateActionType;
  details: AidRequestHistoryEventPayloadInput;
}

export interface AidRequestHistoryEventPayloadInput {
  event: AidRequestUpdateStatusType;
}

export interface FilterFindManyAidRequestHistoryDetailsInput {
  event?: EnumAidRequestHistoryDetailsEvent | null;
  _id?: any | null;
}

export interface FilterFindManyAidRequestHistoryInput {
  action?: EnumAidRequestHistoryAction | null;
  actor?: any | null;
  details?: FilterFindManyAidRequestHistoryDetailsInput | null;
  timestamp?: any | null;
  _id?: any | null;
}

export interface FilterFindManyAidRequestInput {
  completed?: boolean | null;
  createdAt?: any | null;
  history?: (FilterFindManyAidRequestHistoryInput | null)[] | null;
  whatIsNeeded?: string | null;
  whoIsItFor?: string | null;
  whoIsWorkingOnIt?: (string | null)[] | null;
  whoRecordedIt?: string | null;
  whoRecordedItUsername?: string | null;
  _id?: any | null;
  _operators?: FilterFindManyAidRequestOperatorsInput | null;
  OR?: FilterFindManyAidRequestInput[] | null;
  AND?: FilterFindManyAidRequestInput[] | null;
}

/**
 * For performance reason this type contains only *indexed* fields.
 */
export interface FilterFindManyAidRequestOperatorsInput {
  _id?: FilterFindManyAidRequest_idOperatorsInput | null;
}

export interface FilterFindManyAidRequest_idOperatorsInput {
  gt?: any | null;
  gte?: any | null;
  lt?: any | null;
  lte?: any | null;
  ne?: any | null;
  in?: (any | null)[] | null;
  nin?: (any | null)[] | null;
  exists?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

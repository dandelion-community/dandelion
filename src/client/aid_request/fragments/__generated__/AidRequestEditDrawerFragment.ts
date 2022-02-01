/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateActionType, AidRequestHistoryEventType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: AidRequestEditDrawerFragment
// ====================================================

export interface AidRequestEditDrawerFragment_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
}

export interface AidRequestEditDrawerFragment_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: AidRequestEditDrawerFragment_actionsAvailable_input;
}

export interface AidRequestEditDrawerFragment {
  __typename: "AidRequest";
  _id: string;
  actionsAvailable: (AidRequestEditDrawerFragment_actionsAvailable | null)[] | null;
}

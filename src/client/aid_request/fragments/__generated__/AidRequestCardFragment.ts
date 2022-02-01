/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateActionType, AidRequestHistoryEventType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: AidRequestCardFragment
// ====================================================

export interface AidRequestCardFragment_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface AidRequestCardFragment_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface AidRequestCardFragment_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
}

export interface AidRequestCardFragment_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: AidRequestCardFragment_actionsAvailable_input;
}

export interface AidRequestCardFragment {
  __typename: "AidRequest";
  _id: string;
  crew: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: AidRequestCardFragment_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (AidRequestCardFragment_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (AidRequestCardFragment_actionsAvailable | null)[] | null;
}
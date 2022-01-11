/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateStatusType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: AidRequestCardFragment
// ====================================================

export interface AidRequestCardFragment_whoRecordedIt {
  __typename: "User";
  displayName: string;
}

export interface AidRequestCardFragment_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface AidRequestCardFragment_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface AidRequestCardFragment_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: string;
  details: AidRequestCardFragment_actionsAvailable_input_details;
}

export interface AidRequestCardFragment_actionsAvailable {
  __typename: "AidRequestActionOption";
  message: string;
  input: AidRequestCardFragment_actionsAvailable_input;
}

export interface AidRequestCardFragment {
  __typename: "AidRequest";
  _id: any;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: AidRequestCardFragment_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (AidRequestCardFragment_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (AidRequestCardFragment_actionsAvailable | null)[] | null;
}

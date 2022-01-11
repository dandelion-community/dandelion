/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateStatusType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: updateIsAidRequestCompleteMutation
// ====================================================

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoRecordedIt {
  __typename: "User";
  displayName: string;
}

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: string;
  details: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable_input_details;
}

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable {
  __typename: "AidRequestActionOption";
  message: string;
  input: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable_input;
}

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete {
  __typename: "AidRequest";
  _id: any;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_actionsAvailable | null)[] | null;
}

export interface updateIsAidRequestCompleteMutation {
  updateIsAidRequestComplete: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete | null;
}

export interface updateIsAidRequestCompleteMutationVariables {
  id: string;
  newValue: boolean;
}

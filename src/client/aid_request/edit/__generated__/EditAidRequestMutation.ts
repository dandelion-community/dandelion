/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestActionInputInput, AidRequestUpdateActionType, AidRequestHistoryEventType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditAidRequestMutation
// ====================================================

export interface EditAidRequestMutation_payload_object_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface EditAidRequestMutation_payload_object_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface EditAidRequestMutation_payload_object_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
}

export interface EditAidRequestMutation_payload_object_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: EditAidRequestMutation_payload_object_actionsAvailable_input;
}

export interface EditAidRequestMutation_payload_object {
  __typename: "AidRequest";
  _id: string;
  crew: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: EditAidRequestMutation_payload_object_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (EditAidRequestMutation_payload_object_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (EditAidRequestMutation_payload_object_actionsAvailable | null)[] | null;
}

export interface EditAidRequestMutation_payload {
  __typename: "AidRequestHistoryEvent";
  object: EditAidRequestMutation_payload_object | null;
  undoID: string | null;
  postpublishSummary: string | null;
}

export interface EditAidRequestMutation {
  payload: EditAidRequestMutation_payload | null;
}

export interface EditAidRequestMutationVariables {
  aidRequestID: string;
  input: AidRequestActionInputInput;
  undoID?: string | null;
}

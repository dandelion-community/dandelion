/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestActionInputInput, AidRequestUpdateActionType, AidRequestUpdateStatusType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: editAidRequestMutation
// ====================================================

export interface editAidRequestMutation_editAidRequest_aidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface editAidRequestMutation_editAidRequest_aidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  details: editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input_details;
}

export interface editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input;
}

export interface editAidRequestMutation_editAidRequest_aidRequest {
  __typename: "AidRequest";
  _id: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: editAidRequestMutation_editAidRequest_aidRequest_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (editAidRequestMutation_editAidRequest_aidRequest_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (editAidRequestMutation_editAidRequest_aidRequest_actionsAvailable | null)[] | null;
}

export interface editAidRequestMutation_editAidRequest {
  __typename: "AidRequestHistoryEvent";
  aidRequest: editAidRequestMutation_editAidRequest_aidRequest | null;
  undoID: string | null;
  postpublishSummary: string | null;
}

export interface editAidRequestMutation {
  editAidRequest: editAidRequestMutation_editAidRequest | null;
}

export interface editAidRequestMutationVariables {
  aidRequestID: string;
  input: AidRequestActionInputInput;
  undoID?: string | null;
}

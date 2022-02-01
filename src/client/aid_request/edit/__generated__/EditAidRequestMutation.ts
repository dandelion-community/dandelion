/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestActionInputInput, AidRequestUpdateActionType, AidRequestHistoryEventType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: EditAidRequestMutation
// ====================================================

export interface EditAidRequestMutation_editAidRequest_aidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface EditAidRequestMutation_editAidRequest_aidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface EditAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  event: AidRequestHistoryEventType;
}

export interface EditAidRequestMutation_editAidRequest_aidRequest_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: EditAidRequestMutation_editAidRequest_aidRequest_actionsAvailable_input;
}

export interface EditAidRequestMutation_editAidRequest_aidRequest {
  __typename: "AidRequest";
  _id: string;
  crew: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: EditAidRequestMutation_editAidRequest_aidRequest_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (EditAidRequestMutation_editAidRequest_aidRequest_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (EditAidRequestMutation_editAidRequest_aidRequest_actionsAvailable | null)[] | null;
}

export interface EditAidRequestMutation_editAidRequest {
  __typename: "AidRequestHistoryEvent";
  aidRequest: EditAidRequestMutation_editAidRequest_aidRequest | null;
  undoID: string | null;
  postpublishSummary: string | null;
}

export interface EditAidRequestMutation {
  editAidRequest: EditAidRequestMutation_editAidRequest | null;
}

export interface EditAidRequestMutationVariables {
  aidRequestID: string;
  input: AidRequestActionInputInput;
  undoID?: string | null;
}

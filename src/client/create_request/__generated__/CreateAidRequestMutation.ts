/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateActionType, AidRequestUpdateStatusType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAidRequestMutation
// ====================================================

export interface CreateAidRequestMutation_createAidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface CreateAidRequestMutation_createAidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface CreateAidRequestMutation_createAidRequest_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface CreateAidRequestMutation_createAidRequest_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  details: CreateAidRequestMutation_createAidRequest_actionsAvailable_input_details;
}

export interface CreateAidRequestMutation_createAidRequest_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: CreateAidRequestMutation_createAidRequest_actionsAvailable_input;
}

export interface CreateAidRequestMutation_createAidRequest {
  __typename: "AidRequest";
  _id: string;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: CreateAidRequestMutation_createAidRequest_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (CreateAidRequestMutation_createAidRequest_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (CreateAidRequestMutation_createAidRequest_actionsAvailable | null)[] | null;
}

export interface CreateAidRequestMutation {
  createAidRequest: CreateAidRequestMutation_createAidRequest | null;
}

export interface CreateAidRequestMutationVariables {
  crew: string;
  whatIsNeeded: string;
  whoIsItFor: string;
}

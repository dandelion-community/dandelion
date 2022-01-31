/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestUpdateActionType, AidRequestUpdateStatusType } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: AidRequestDetailsQuery
// ====================================================

export interface AidRequestDetailsQuery_aidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface AidRequestDetailsQuery_aidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface AidRequestDetailsQuery_aidRequest_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface AidRequestDetailsQuery_aidRequest_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  details: AidRequestDetailsQuery_aidRequest_actionsAvailable_input_details;
}

export interface AidRequestDetailsQuery_aidRequest_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: AidRequestDetailsQuery_aidRequest_actionsAvailable_input;
}

export interface AidRequestDetailsQuery_aidRequest {
  __typename: "AidRequest";
  _id: string;
  crew: string | null;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: AidRequestDetailsQuery_aidRequest_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (AidRequestDetailsQuery_aidRequest_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (AidRequestDetailsQuery_aidRequest_actionsAvailable | null)[] | null;
}

export interface AidRequestDetailsQuery {
  aidRequest: AidRequestDetailsQuery_aidRequest;
}

export interface AidRequestDetailsQueryVariables {
  aidRequestID: string;
}

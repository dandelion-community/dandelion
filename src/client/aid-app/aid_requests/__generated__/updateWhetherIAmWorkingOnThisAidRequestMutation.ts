/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateWhetherIAmWorkingOnThisAidRequestMutation
// ====================================================

export interface updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest_whoRecordedIt {
  __typename: "User";
  displayName: string;
}

export interface updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest {
  __typename: "AidRequest";
  _id: any;
  latestEvent: string;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest_whoIsWorkingOnItUsers | null)[] | null;
}

export interface updateWhetherIAmWorkingOnThisAidRequestMutation {
  updateWhetherIAmWorkingOnThisAidRequest: updateWhetherIAmWorkingOnThisAidRequestMutation_updateWhetherIAmWorkingOnThisAidRequest | null;
}

export interface updateWhetherIAmWorkingOnThisAidRequestMutationVariables {
  aidRequestID: string;
  iAmWorkingOnIt: boolean;
}

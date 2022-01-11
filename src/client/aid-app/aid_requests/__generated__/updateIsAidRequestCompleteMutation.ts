/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

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

export interface updateIsAidRequestCompleteMutation_updateIsAidRequestComplete {
  __typename: "AidRequest";
  _id: any;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (updateIsAidRequestCompleteMutation_updateIsAidRequestComplete_whoIsWorkingOnItUsers | null)[] | null;
}

export interface updateIsAidRequestCompleteMutation {
  updateIsAidRequestComplete: updateIsAidRequestCompleteMutation_updateIsAidRequestComplete | null;
}

export interface updateIsAidRequestCompleteMutationVariables {
  id: string;
  newValue: boolean;
}

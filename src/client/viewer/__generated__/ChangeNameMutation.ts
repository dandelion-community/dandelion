/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeNameMutation
// ====================================================

export interface ChangeNameMutation_payload {
  __typename: "User";
  _id: string;
  displayName: string;
}

export interface ChangeNameMutation {
  payload: ChangeNameMutation_payload | null;
}

export interface ChangeNameMutationVariables {
  displayName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LogoutActionMutation
// ====================================================

export interface LogoutActionMutation_logout_user {
  __typename: "User";
  username: string;
}

export interface LogoutActionMutation_logout {
  __typename: "CurrentUser";
  user: LogoutActionMutation_logout_user | null;
}

export interface LogoutActionMutation {
  logout: LogoutActionMutation_logout | null;
}

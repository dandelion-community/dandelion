/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ResetPasswordLinkDetailsQuery
// ====================================================

export interface ResetPasswordLinkDetailsQuery_resetPasswordLinkDetails {
  __typename: "ResetPasswordLinkDetails";
  username: string;
  expiration_time: any;
  is_valid: boolean;
}

export interface ResetPasswordLinkDetailsQuery {
  resetPasswordLinkDetails: ResetPasswordLinkDetailsQuery_resetPasswordLinkDetails | null;
}

export interface ResetPasswordLinkDetailsQueryVariables {
  token: string;
}

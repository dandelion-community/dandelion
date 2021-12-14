/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_user {
  __typename: "User";
  username: string | null;
}

export interface Register_register {
  __typename: "CurrentUserPayload";
  user: Register_register_user | null;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  username: string;
  password: string;
}

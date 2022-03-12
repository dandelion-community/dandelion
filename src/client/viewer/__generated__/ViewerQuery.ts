/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ViewerQuery
// ====================================================

export interface ViewerQuery_me_taggableUsers {
  __typename: "User";
  id: string;
  displayName: string;
}

export interface ViewerQuery_me {
  __typename: "User";
  _id: string;
  username: string;
  displayName: string;
  crews: string[];
  taggableUsers: ViewerQuery_me_taggableUsers[];
}

export interface ViewerQuery {
  me: ViewerQuery_me | null;
}

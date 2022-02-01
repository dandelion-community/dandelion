/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ActivityItemFragment
// ====================================================

export interface ActivityItemFragment_actor {
  __typename: "User";
  displayName: string;
}

export interface ActivityItemFragment {
  __typename: "AidRequestActivityItem";
  _id: string;
  actor: ActivityItemFragment_actor | null;
  isComment: boolean;
  message: string;
  when: string;
}

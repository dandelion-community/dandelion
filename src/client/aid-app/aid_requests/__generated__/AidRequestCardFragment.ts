/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AidRequestCardFragment
// ====================================================

export interface AidRequestCardFragment_whoIsWorkingOnItUsers {
  __typename: "User";
  username: string | null;
  _id: string;
}

export interface AidRequestCardFragment {
  __typename: "AidRequest";
  _id: any;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedItUsername: string | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (AidRequestCardFragment_whoIsWorkingOnItUsers | null)[] | null;
}

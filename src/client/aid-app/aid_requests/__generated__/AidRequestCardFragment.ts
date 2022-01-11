/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AidRequestCardFragment
// ====================================================

export interface AidRequestCardFragment_whoRecordedIt {
  __typename: "User";
  displayName: string;
}

export interface AidRequestCardFragment_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface AidRequestCardFragment {
  __typename: "AidRequest";
  _id: any;
  latestEvent: string;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: AidRequestCardFragment_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (AidRequestCardFragment_whoIsWorkingOnItUsers | null)[] | null;
}

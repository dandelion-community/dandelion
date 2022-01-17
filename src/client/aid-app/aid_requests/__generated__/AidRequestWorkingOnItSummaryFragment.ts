/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AidRequestWorkingOnItSummaryFragment
// ====================================================

export interface AidRequestWorkingOnItSummaryFragment_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface AidRequestWorkingOnItSummaryFragment {
  __typename: "AidRequest";
  _id: any;
  whoIsWorkingOnItUsers: (AidRequestWorkingOnItSummaryFragment_whoIsWorkingOnItUsers | null)[] | null;
}

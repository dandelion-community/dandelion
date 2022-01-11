/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FilterFindManyAidRequestInput } from "./../../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: ListOfAidRequestsQuery
// ====================================================

export interface ListOfAidRequestsQuery_allAidRequests_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: string | null;
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_whoRecordedIt {
  __typename: "User";
  displayName: string;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_whoIsWorkingOnItUsers {
  __typename: "User";
  displayName: string;
  _id: string;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node {
  __typename: "AidRequest";
  _id: any;
  whatIsNeeded: string | null;
  whoIsItFor: string | null;
  whoRecordedIt: ListOfAidRequestsQuery_allAidRequests_edges_node_whoRecordedIt | null;
  completed: boolean | null;
  whoIsWorkingOnItUsers: (ListOfAidRequestsQuery_allAidRequests_edges_node_whoIsWorkingOnItUsers | null)[] | null;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges {
  __typename: "AidRequestEdge";
  /**
   * The item at the end of the edge
   */
  node: ListOfAidRequestsQuery_allAidRequests_edges_node;
}

export interface ListOfAidRequestsQuery_allAidRequests {
  __typename: "AidRequestConnection";
  /**
   * Information to aid in pagination.
   */
  pageInfo: ListOfAidRequestsQuery_allAidRequests_pageInfo;
  /**
   * Information to aid in pagination.
   */
  edges: ListOfAidRequestsQuery_allAidRequests_edges[];
}

export interface ListOfAidRequestsQuery {
  allAidRequests: ListOfAidRequestsQuery_allAidRequests | null;
}

export interface ListOfAidRequestsQueryVariables {
  pageSize: number;
  after?: string | null;
  filter?: FilterFindManyAidRequestInput | null;
}

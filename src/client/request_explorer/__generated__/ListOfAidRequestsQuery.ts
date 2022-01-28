/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AidRequestFilterInput, AidRequestUpdateActionType, AidRequestUpdateStatusType } from "./../../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: ListOfAidRequestsQuery
// ====================================================

export interface ListOfAidRequestsQuery_allAidRequests_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_whoRecordedIt {
  __typename: "User";
  displayName: string;
  username: string;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_whoIsWorkingOnItUsers {
  __typename: "User";
  _id: string;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable_input_details {
  __typename: "AidRequestHistoryEventPayload";
  event: AidRequestUpdateStatusType;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable_input {
  __typename: "AidRequestActionInput";
  action: AidRequestUpdateActionType;
  details: ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable_input_details;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable {
  __typename: "AidRequestActionOption";
  icon: string | null;
  message: string;
  input: ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable_input;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges_node {
  __typename: "AidRequest";
  _id: string;
  crew: string | null;
  completed: boolean;
  latestEvent: string;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedIt: ListOfAidRequestsQuery_allAidRequests_edges_node_whoRecordedIt | null;
  whoIsWorkingOnItUsers: (ListOfAidRequestsQuery_allAidRequests_edges_node_whoIsWorkingOnItUsers | null)[] | null;
  actionsAvailable: (ListOfAidRequestsQuery_allAidRequests_edges_node_actionsAvailable | null)[] | null;
}

export interface ListOfAidRequestsQuery_allAidRequests_edges {
  __typename: "AidRequestEdge";
  node: ListOfAidRequestsQuery_allAidRequests_edges_node;
}

export interface ListOfAidRequestsQuery_allAidRequests {
  __typename: "AidRequestConnection";
  pageInfo: ListOfAidRequestsQuery_allAidRequests_pageInfo;
  edges: ListOfAidRequestsQuery_allAidRequests_edges[];
}

export interface ListOfAidRequestsQuery {
  allAidRequests: ListOfAidRequestsQuery_allAidRequests;
}

export interface ListOfAidRequestsQueryVariables {
  pageSize: number;
  after?: string | null;
  filter?: AidRequestFilterInput | null;
}

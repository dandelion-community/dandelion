import client from '../graphql/client';
import type { FilterType } from '../navigation/screens/main/request_explorer/filters/RequestExplorerFiltersContext';
import { FILTERS } from '../navigation/screens/main/request_explorer/RequestExplorerFilters';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from './ListOfAidRequestsQuery';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
  ListOfAidRequestsQuery_allAidRequests_edges,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from './__generated__/ListOfAidRequestsQuery';

type SubscriberEntry = {
  data: ListOfAidRequestsQuery;
  filter: FilterType;
};

const SUBSCRIBERS: Map<string, SubscriberEntry> = new Map();

export function subscribeQueryToAidRequestUpdates(
  filter: FilterType,
  data: ListOfAidRequestsQuery,
): void {
  SUBSCRIBERS.set(JSON.stringify(filter), { data, filter });
}

export function broadcastAidRequestUpdated(
  aidRequest:
    | ListOfAidRequestsQuery_allAidRequests_edges_node
    | undefined
    | null,
): void {
  if (aidRequest == null) {
    console.error('Unexpected null');
    return;
  }
  SUBSCRIBERS.forEach((entry: SubscriberEntry): void => {
    processAidRequestUpdateForQuery(entry, aidRequest);
  });
}

function processAidRequestUpdateForQuery(
  { filter, data: list }: SubscriberEntry,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
): void {
  if (passesFilter(filter, aidRequest)) {
    addAidRequestIfNotPresent(filter, list, aidRequest);
  } else {
    removeAidRequestIfPresent(filter, list, aidRequest);
  }
}

function passesFilter(
  filter: FilterType,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
): boolean {
  return FILTERS.every(({ passes }) => passes(filter, aidRequest));
}

function addAidRequestIfNotPresent(
  filter: FilterType,
  list: ListOfAidRequestsQuery,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
): void {
  const { _id: aidRequestID } = aidRequest;
  if (
    list.allAidRequests?.edges.some((edge) => edge.node._id === aidRequestID)
  ) {
    return;
  }
  const oldEdges = list.allAidRequests?.edges ?? [];
  const newEdges: ListOfAidRequestsQuery_allAidRequests_edges[] = [
    {
      __typename: 'AidRequestEdge',
      node: aidRequest,
    },
    ...oldEdges,
  ];
  publishNewEdges(filter, newEdges, list);
}

function removeAidRequestIfPresent(
  filter: FilterType,
  list: ListOfAidRequestsQuery,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
): void {
  const { _id: aidRequestID } = aidRequest;
  if (
    !list.allAidRequests?.edges.some((edge) => edge.node._id === aidRequestID)
  ) {
    return;
  }
  const oldEdges = list.allAidRequests?.edges ?? [];
  const newEdges: ListOfAidRequestsQuery_allAidRequests_edges[] =
    oldEdges.filter((edge) => edge.node._id !== aidRequestID);
  publishNewEdges(filter, newEdges, list);
}

function publishNewEdges(
  filter: FilterType,
  edges: ListOfAidRequestsQuery_allAidRequests_edges[],
  list: ListOfAidRequestsQuery,
): void {
  const data: ListOfAidRequestsQuery = {
    allAidRequests: {
      __typename: 'AidRequestConnection',
      edges,
      pageInfo: list.allAidRequests?.pageInfo ?? {
        __typename: 'PageInfo',
        endCursor: null,
        hasNextPage: true,
      },
    },
  };
  client.cache.writeQuery<
    ListOfAidRequestsQuery,
    ListOfAidRequestsQueryVariables
  >({
    broadcast: true,
    data,
    overwrite: true,
    query: LIST_OF_AID_REQUESTS_QUERY,
    variables: { after: null, filter, pageSize: PAGE_SIZE },
  });
  subscribeQueryToAidRequestUpdates(filter, data);
}

import { notifyAidRequestDetailScreenAboutMutation } from 'src/client/aid_request/detail/AidRequestDetailScreen';
import client from 'src/client/graphql/client';
import { FILTERS } from 'src/client/request_explorer/RequestExplorerFilters';
import type { FilterType } from 'src/client/request_explorer/RequestExplorerFiltersContext';
import filterNulls from 'src/shared/utils/filterNulls';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from './ListOfAidRequestsQuery';
import { FilterContext } from './RequestExplorerFilterButton';
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
  aidRequestID: string,
  aidRequest:
    | ListOfAidRequestsQuery_allAidRequests_edges_node
    | undefined
    | null,
  filterContext: FilterContext,
): void {
  notifyAidRequestDetailScreenAboutMutation(aidRequestID);
  SUBSCRIBERS.forEach((entry: SubscriberEntry): void => {
    processAidRequestUpdateForQuery(
      entry,
      aidRequestID,
      aidRequest ?? null,
      filterContext,
    );
  });
}

function processAidRequestUpdateForQuery(
  { filter, data: list }: SubscriberEntry,
  aidRequestID: string,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node | null,
  filterContext: FilterContext,
): void {
  if (passesFilter(filter, aidRequest, filterContext)) {
    addAidRequestIfNotPresent(filter, list, aidRequest);
  } else {
    removeAidRequestIfPresent(filter, list, aidRequestID);
  }
}

function passesFilter(
  filter: FilterType,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node | null,
  filterContext: FilterContext,
): boolean {
  if (aidRequest == null) {
    return false;
  }
  return FILTERS.every(({ passes }) =>
    passes(filter, aidRequest, filterContext),
  );
}

function addAidRequestIfNotPresent(
  filter: FilterType,
  list: ListOfAidRequestsQuery,
  aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node | null,
): void {
  if (aidRequest == null) {
    return;
  }
  const { _id: aidRequestID } = aidRequest;
  if (
    (list.allAidRequests?.edges ?? []).some(
      (edge) => edge?.node?._id === aidRequestID,
    )
  ) {
    return;
  }
  const oldEdges = filterNulls(list.allAidRequests?.edges ?? []);
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
  aidRequestID: string,
): void {
  if (
    !list.allAidRequests.edges.some((edge) => edge.node._id === aidRequestID)
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

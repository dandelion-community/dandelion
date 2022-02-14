import { notifyAidRequestDetailScreenAboutMutation } from 'src/client/aid_request/detail/AidRequestDetailScreen';
import { graphqlNodeDraftStore } from 'src/client/aid_request/drafts/AidRequestDraftsMemoryStore';
import { FilterContext } from 'src/client/aid_request/filter/FilterContext';
import { FILTERS } from 'src/client/aid_request/filter/RequestExplorerFilters';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from 'src/client/aid_request/list/ListOfAidRequestsQuery';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
  ListOfAidRequestsQuery_allAidRequests_edges,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import client from 'src/client/graphql/client';
import filterNulls from 'src/shared/utils/filterNulls';
import { isDraftID } from '../drafts/AidRequestDraftIDs';
import LocalUpdateSubscriberStore, {
  SubscriberValue,
} from './LocalUpdateSubscriberStore';

export function broadcastUpdatedAidRequest(
  aidRequestID: string,
  aidRequest:
    | ListOfAidRequestsQuery_allAidRequests_edges_node
    | undefined
    | null,
): void {
  broadcastAidRequestUpdates([{ id: aidRequestID, value: aidRequest }]);
}

export function broadcastManyNewAidRequests(
  aidRequests: Array<
    ListOfAidRequestsQuery_allAidRequests_edges_node | undefined | null
  >,
): void {
  broadcastAidRequestUpdates(
    filterNulls(aidRequests).map((value) => ({ id: value._id, value })),
  );
}

export function broadcastDeletedAidRequest(aidRequestID: string): void {
  broadcastAidRequestUpdates([{ id: aidRequestID, value: null }]);
}

type Update = {
  id: string;
  value: ListOfAidRequestsQuery_allAidRequests_edges_node | undefined | null;
};

function broadcastAidRequestUpdates(updates: Update[]): void {
  notifyAidRequestDetailScreenAboutMutation(updates.map(({ id }) => id));
  LocalUpdateSubscriberStore.forEach((subscriber: SubscriberValue): void => {
    processAidRequestUpdatesForSubscriber(subscriber, updates);
  });
}

function processAidRequestUpdatesForSubscriber(
  subscriber: SubscriberValue,
  updates: Update[],
): void {
  const { filter, filterContext } = subscriber;
  const toAdd: ListOfAidRequestsQuery_allAidRequests_edges_node[] = [];
  const toRemove: string[] = [];
  updates.forEach((update: Update): void => {
    if (passesFilter(subscriber, update)) {
      const { value } = update;
      if (value != null && !idIsPresent(subscriber, update)) {
        toAdd.push(value);
      }
    } else {
      if (idIsPresent(subscriber, update)) {
        toRemove.push(update.id);
      }
    }
  });
  if (toAdd.length === 0 && toRemove.length === 0) {
    return;
  }
  const oldEdges = filterNulls(subscriber.data.allAidRequests?.edges ?? []);
  const filteredEdges: ListOfAidRequestsQuery_allAidRequests_edges[] =
    oldEdges.filter((edge) => !toRemove.includes(edge.node._id));
  const withAdditions: ListOfAidRequestsQuery_allAidRequests_edges[] = [
    ...toAdd.map(
      (node) =>
        ({
          __typename: 'AidRequestEdge',
          node,
        } as ListOfAidRequestsQuery_allAidRequests_edges),
    ),
    ...filteredEdges,
  ];
  publishNewEdges(filter, withAdditions, subscriber.data, filterContext);
}

function passesFilter(subscriber: SubscriberValue, update: Update): boolean {
  const { value: aidRequest } = update;
  const { filter, filterContext } = subscriber;
  if (aidRequest == null) {
    return false;
  }
  return FILTERS.every(({ passes }) =>
    passes(filter, aidRequest, filterContext),
  );
}

function idIsPresent(subscriber: SubscriberValue, update: Update): boolean {
  const { id } = update;
  const { data } = subscriber;
  return (data.allAidRequests?.edges ?? []).some(
    (edge) => edge?.node?._id === id,
  );
}

function publishNewEdges(
  filter: FilterType,
  edges_: ListOfAidRequestsQuery_allAidRequests_edges[],
  list: ListOfAidRequestsQuery,
  filterContext: FilterContext,
): void {
  const edges = edges_.filter(isNotStaleDraft);
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
  LocalUpdateSubscriberStore.add({ data, filter, filterContext });
}

function isNotStaleDraft(
  value: ListOfAidRequestsQuery_allAidRequests_edges,
): boolean {
  const id = value.node._id;
  if (!isDraftID(id)) {
    return true;
  }
  return graphqlNodeDraftStore.getValue().some((draft) => draft._id === id);
}

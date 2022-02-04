import { QueryResult, useQuery } from '@apollo/client';
import * as React from 'react';
import * as AidRequestDraftsStore from 'src/client/aid_request/drafts/AidRequestDraftsStore';
import type { FilterType } from 'src/client/request_explorer/RequestExplorerFiltersContext';
import LocalUpdateSubscriberStore from '../aid_request/cache/LocalUpdateSubscriberStore';
import { useFilterContext } from './FilterContext';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from './ListOfAidRequestsQuery';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
  ListOfAidRequestsQuery_allAidRequests_edges,
} from './__generated__/ListOfAidRequestsQuery';

export default function useListOfAidRequests(
  filter: FilterType,
): QueryResult<ListOfAidRequestsQuery, ListOfAidRequestsQueryVariables> {
  const filterContext = useFilterContext();
  const apolloResult = useQuery<
    ListOfAidRequestsQuery,
    ListOfAidRequestsQueryVariables
  >(LIST_OF_AID_REQUESTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { after: null, filter, pageSize: PAGE_SIZE },
  });
  const drafts = AidRequestDraftsStore.useGraphQLValues();
  const { data, ...rest } = apolloResult;
  React.useEffect(() => {
    if (data != null) {
      LocalUpdateSubscriberStore.add({ data, filter, filterContext });
    }
  }, [filter, data]);

  if (data == null) {
    return apolloResult;
  }

  if (drafts.length === 0) {
    return apolloResult;
  }

  const { allAidRequests, ...restOfGraphQLData } = data;
  const { edges: graphQLEdges, ...restOfAllAidRequests } = allAidRequests;

  const edges = [
    ...drafts.map(
      (node) =>
        ({
          __typename: 'AidRequestEdge',
          node,
        } as ListOfAidRequestsQuery_allAidRequests_edges),
    ),
    ...graphQLEdges,
  ];

  return {
    data: {
      allAidRequests: {
        edges,
        ...restOfAllAidRequests,
      },
      ...restOfGraphQLData,
    },
    ...rest,
  };
}

import { QueryResult, useQuery } from '@apollo/client';
import * as React from 'react';
import LocalUpdateSubscriberStore from 'src/client/aid_request/cache/LocalUpdateSubscriberStore';
import { graphqlEdgeDraftStore } from 'src/client/aid_request/drafts/AidRequestDraftsMemoryStore';
import { useFilterContext } from 'src/client/aid_request/filter/FilterContext';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from 'src/client/aid_request/list/ListOfAidRequestsQuery';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
} from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import useStore from 'src/client/store/useStore';

export default function useListOfAidRequests(
  filter: FilterType,
): QueryResult<ListOfAidRequestsQuery, ListOfAidRequestsQueryVariables> {
  const filterContext = useFilterContext();
  const apolloResult = useQuery<
    ListOfAidRequestsQuery,
    ListOfAidRequestsQueryVariables
  >(LIST_OF_AID_REQUESTS_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    variables: { after: null, filter, pageSize: PAGE_SIZE },
  });
  const drafts = useStore(graphqlEdgeDraftStore);
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

  const edges = [...drafts, ...graphQLEdges];

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

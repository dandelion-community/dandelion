import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import type { ListOfAidRequestsQuery_allAidRequests } from 'request_explorer/__generated__/ListOfAidRequestsQuery';

export default function createClient(
  uri: string,
): ApolloClient<NormalizedCacheObject> {
  const link = createHttpLink({
    uri,
  });
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allAidRequests: {
            // This tells Apollo not to treat queries with different
            // args on this field ("first", "after") as different
            // cache entries. This is important so we can merge
            // old query results with new query results during
            // infinite scroll
            keyArgs: ['filter'],
            merge(
              existing:
                | ListOfAidRequestsQuery_allAidRequests
                | null
                | undefined,
              incoming: ListOfAidRequestsQuery_allAidRequests,
            ): ListOfAidRequestsQuery_allAidRequests {
              if (existing == null) {
                return incoming;
              }
              return {
                __typename: incoming.__typename,
                edges: existing.edges.concat(incoming.edges),
                pageInfo: incoming.pageInfo,
              };
            },
          },
        },
      },
    },
  });

  const client = new ApolloClient({
    cache,
    credentials: 'include',
    link,
  });

  return client;
}

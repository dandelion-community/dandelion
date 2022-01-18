import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import type { ListOfAidRequestsQuery_allAidRequests_pageInfo } from 'src/client/request_explorer/__generated__/ListOfAidRequestsQuery';

type Edge = {
  __typename: 'AidRequestEdge';
  node: {
    __ref: string;
  };
};

type Entry = {
  __typename: 'AidRequestConnection';
  pageInfo: ListOfAidRequestsQuery_allAidRequests_pageInfo;
  edges: Edge[];
};

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
            merge(existing: Entry | null | undefined, incoming: Entry): Entry {
              if (existing == null) {
                return incoming;
              }
              return {
                __typename: incoming.__typename,
                edges: existing.edges.concat(
                  incoming.edges.filter((incomingEdge: Edge): boolean => {
                    return !existing.edges.some(
                      (existingEdge: Edge): boolean =>
                        existingEdge.node.__ref === incomingEdge.node.__ref,
                    );
                  }),
                ),
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

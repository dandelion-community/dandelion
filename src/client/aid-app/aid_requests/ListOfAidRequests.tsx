import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import filterNulls from '../../general-purpose/utils/filterNulls';
import AidRequestCard from './AidRequestCard';
import { AidRequestCardFragments } from './AidRequestCardFragments';
import type {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from './__generated__/ListOfAidRequestsQuery';

const PAGE_SIZE = 5;

const LIST_OF_AID_REQUESTS_QUERY = gql`
  query ListOfAidRequestsQuery(
    $pageSize: Int!
    $after: String
    $filter: FilterFindManyAidRequestInput
  ) {
    allAidRequests(first: $pageSize, after: $after, filter: $filter) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...AidRequestCardFragment
        }
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

export default function ListOfRequests(): JSX.Element {
  const {
    data,
    loading: isLoadingEitherIncrementallyOrEntireScreen,
    fetchMore,
    refetch,
  } = useQuery<ListOfAidRequestsQuery, ListOfAidRequestsQueryVariables>(
    LIST_OF_AID_REQUESTS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        after: null,
        pageSize: PAGE_SIZE,
        filter: { completed: false },
      },
    },
  );

  const [isLoadingEntireScreen, setIsLoadingEntireScreen] =
    React.useState(true);
  const [isLoadingIncremental, setIsLoadingIncremental] = React.useState(false);

  const refresh = React.useCallback(() => {
    setIsLoadingEntireScreen(true);
    refetch();
  }, []);

  React.useEffect(() => {
    if (!isLoadingEitherIncrementallyOrEntireScreen) {
      setIsLoadingIncremental(false);
      setIsLoadingEntireScreen(false);
    }
  }, [isLoadingEitherIncrementallyOrEntireScreen]);

  const footer = React.useMemo(() => <ActivityIndicator />, []);
  const edges = data == null ? null : data.allAidRequests?.edges;
  const nodes: null | Array<ListOfAidRequestsQuery_allAidRequests_edges_node> =
    React.useMemo(() => {
      if (edges == null) {
        return null;
      }
      return filterNulls(edges.map((edge) => edge?.node));
    }, [edges]);

  return (
    <View style={styles.container}>
      <FlatList
        ListFooterComponent={isLoadingIncremental ? footer : null}
        data={nodes}
        keyExtractor={({ _id }) => _id}
        onEndReached={data == null ? () => null : () => onEndReached(data)}
        onEndReachedThreshold={0.5}
        onRefresh={refresh}
        refreshing={isLoadingEntireScreen}
        renderItem={renderItem}
      />
    </View>
  );

  function renderItem({
    item,
    index: _index,
    separators: _separators,
  }: ListRenderItemInfo<ListOfAidRequestsQuery_allAidRequests_edges_node>): React.ReactElement | null {
    return <AidRequestCard aidRequest={item} />;
  }

  function onEndReached(data: ListOfAidRequestsQuery): void {
    if (!data.allAidRequests?.pageInfo.hasNextPage || isLoadingIncremental) {
      return;
    }
    setIsLoadingIncremental(true);
    fetchMore({
      variables: {
        after: data.allAidRequests.pageInfo.endCursor,
        first: PAGE_SIZE,
      },
    });
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {},
});

import { useQuery } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import View from 'src/client/components/View';
import { useRequestExplorerFilters } from 'src/client/request_explorer/RequestExplorerFiltersContext';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';
import filterNulls from '../../shared/utils/filterNulls';
import AidRequestCard from './AidRequestCard';
import { subscribeQueryToAidRequestUpdates } from './AidRequestFilterLocalCacheUpdater';
import {
  LIST_OF_AID_REQUESTS_QUERY,
  PAGE_SIZE,
} from './ListOfAidRequestsQuery';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQueryVariables,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from './__generated__/ListOfAidRequestsQuery';

type Props = { viewRequestHistory: (requestID: string) => void };

export default function ListOfRequests({
  viewRequestHistory,
}: Props): JSX.Element {
  const { filter } = useRequestExplorerFilters();
  const { data, loading, fetchMore, refetch } = useQuery<
    ListOfAidRequestsQuery,
    ListOfAidRequestsQueryVariables
  >(LIST_OF_AID_REQUESTS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { after: null, filter, pageSize: PAGE_SIZE },
  });
  React.useEffect(() => {
    if (data != null) {
      subscribeQueryToAidRequestUpdates(filter, data);
    }
  }, [filter, data]);

  const footer = React.useMemo(() => <ActivityIndicator />, []);
  const edges = data == null ? null : data.allAidRequests?.edges;
  const nodes: null | Array<ListOfAidRequestsQuery_allAidRequests_edges_node> =
    React.useMemo(() => {
      if (edges == null) {
        return null;
      }
      return filterNulls(edges.map((edge) => edge?.node));
    }, [edges]);

  const isLoadingEntireScreen =
    loading && (nodes == null || nodes.length === 0);
  const isLoadingIncremental = loading && !isLoadingEntireScreen;

  return (
    <View style={styles.container}>
      {isLoadingEntireScreen ? (
        <View style={{ marginTop: 16 }}>
          <DebouncedLoadingIndicator />
        </View>
      ) : null}
      <FlatList
        ListFooterComponent={isLoadingIncremental ? footer : null}
        data={nodes}
        keyExtractor={({ _id }) => _id}
        onEndReached={data == null ? () => null : () => onEndReached(data)}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
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
    return (
      <AidRequestCard
        aidRequest={item}
        viewRequestHistory={viewRequestHistory}
      />
    );
  }

  function onEndReached(data: ListOfAidRequestsQuery): void {
    if (!data.allAidRequests?.pageInfo.hasNextPage || isLoadingIncremental) {
      return;
    }
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
});

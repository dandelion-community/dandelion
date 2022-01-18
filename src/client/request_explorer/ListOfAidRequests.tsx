import { useQuery } from '@apollo/client';
import View from 'components/View';
import DebouncedLoadingIndicator from 'utils/DebouncedLoadingIndicator';
import { useRequestExplorerFilters } from 'request_explorer/RequestExplorerFiltersContext';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
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
  const {
    data,
    loading: isLoadingEitherIncrementallyOrEntireScreen,
    fetchMore,
    refetch,
  } = useQuery<ListOfAidRequestsQuery, ListOfAidRequestsQueryVariables>(
    LIST_OF_AID_REQUESTS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      variables: { after: null, filter, pageSize: PAGE_SIZE },
    },
  );
  React.useEffect(() => {
    if (data != null) {
      subscribeQueryToAidRequestUpdates(filter, data);
    }
  }, [filter, data]);

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
    } else if (!isLoadingIncremental) {
      setIsLoadingEntireScreen(true);
    }
  }, [isLoadingEitherIncrementallyOrEntireScreen, isLoadingIncremental]);

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
});

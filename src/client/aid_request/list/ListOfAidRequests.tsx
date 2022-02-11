import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AidRequestCard from 'src/client/aid_request/card/AidRequestCard';
import { GoToRequestDetailScreen } from 'src/client/aid_request/detail/AidRequestDetailScreen';
import { useRequestExplorerFilters } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import { PAGE_SIZE } from 'src/client/aid_request/list/ListOfAidRequestsQuery';
import useListOfAidRequests from 'src/client/aid_request/list/useListOfAidRequests';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import EndOfListSpacer from 'src/client/components/EndOfListSpacer';
import View from 'src/client/components/View';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';
import filterNulls from 'src/shared/utils/filterNulls';

type Props = {
  goToRequestDetailScreen: GoToRequestDetailScreen;
};

export default function ListOfRequests({
  goToRequestDetailScreen,
}: Props): JSX.Element {
  const { filter } = useRequestExplorerFilters();
  const { data, loading, fetchMore, refetch } = useListOfAidRequests(filter);

  const footer = React.useMemo(() => <ActivityIndicator />, []);
  const edges = data == null ? null : data.allAidRequests?.edges;
  const nodes: null | Array<
    undefined | ListOfAidRequestsQuery_allAidRequests_edges_node
  > = React.useMemo(() => {
    if (edges == null) {
      return null;
    }
    return [...filterNulls(edges.map((edge) => edge?.node)), undefined];
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
        keyExtractor={(item) => (item === undefined ? 'undefined' : item._id)}
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
  }: ListRenderItemInfo<
    undefined | ListOfAidRequestsQuery_allAidRequests_edges_node
  >): React.ReactElement | null {
    if (item === undefined) {
      return <EndOfListSpacer />;
    }
    return (
      <AidRequestCard
        aidRequest={item}
        goToRequestDetailScreen={goToRequestDetailScreen}
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

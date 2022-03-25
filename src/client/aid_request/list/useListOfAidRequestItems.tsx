import { ApolloError } from '@apollo/client';
import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import AidRequestCard from 'src/client/aid_request/card/AidRequestCard';
import { GoToRequestDetailScreen } from 'src/client/aid_request/detail/AidRequestDetailScreen';
import { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import { PAGE_SIZE } from 'src/client/aid_request/list/ListOfAidRequestsQuery';
import useListOfAidRequests from 'src/client/aid_request/list/useListOfAidRequests';
import {
  ListOfAidRequestsQuery,
  ListOfAidRequestsQuery_allAidRequests_edges_node,
} from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import EndOfListSpacer from 'src/client/components/EndOfListSpacer';
import ErrorNotice from 'src/client/components/ErrorNotice';
import {
  ScrollableScreenItem,
  SectionRendererData,
} from 'src/client/scrollable_screen/ScrollableScreen';
import filterNulls from 'src/shared/utils/filterNulls';

type Props = {
  goToRequestDetailScreen: GoToRequestDetailScreen;
  filter: FilterType;
};

type Node =
  | ListOfAidRequestsQuery_allAidRequests_edges_node
  | 'spacer'
  | 'loading'
  | ApolloError;

export default function useListOfAidRequestItems({
  goToRequestDetailScreen,
  filter,
}: Props): SectionRendererData {
  const { data, error, loading, fetchMore, refetch } =
    useListOfAidRequests(filter);
  const edges = data == null ? null : data.allAidRequests?.edges;

  console.log('error', error);
  console.log('data', data);

  const nodes: Array<Node> = React.useMemo(() => {
    const isLoadingEntireScreen = loading && !edges?.length;
    const isLoadingIncremental = loading && !isLoadingEntireScreen;
    const errorNodes: Array<Node> = error == null ? [] : [error];
    const loadingHeaderNodes: Array<Node> = isLoadingEntireScreen
      ? ['loading']
      : [];
    const loadingFooterNodes: Array<Node> = isLoadingIncremental
      ? ['loading']
      : [];
    if (edges == null && loading) {
      return loadingHeaderNodes;
    }
    const nodes: Array<Node> = [
      ...loadingHeaderNodes,
      ...errorNodes,
      ...filterNulls((edges ?? []).map((edge) => edge?.node)),
      ...loadingFooterNodes,
      'spacer',
    ];
    console.log('nodes', nodes);
    return nodes;
  }, [loading, error, edges]);

  const listItems = (nodes ?? []).map((node: Node): ScrollableScreenItem => {
    return {
      key: getKey(node),
      render: () => renderItem(node),
    };
  });

  return {
    onEndReached: data == null ? () => null : () => onEndReached(data),
    onEndReachedThreshold: 0.5,
    onRefresh: refetch,
    refreshing: loading && !edges?.length,
    section: {
      data: listItems,
      key: 'aid-request-list',
    },
  };

  function renderItem(item: Node): React.ReactElement | null {
    if (item === 'spacer') {
      return <EndOfListSpacer />;
    }
    if (item === 'loading') {
      return <ProgressBar indeterminate={true} />;
    }
    if (item instanceof ApolloError) {
      return (
        <ErrorNotice
          error={error}
          whenTryingToDoWhat="load the list of aid requests"
        />
      );
    }
    return (
      <AidRequestCard
        aidRequest={item}
        goToRequestDetailScreen={goToRequestDetailScreen}
      />
    );
  }

  function getKey(item: Node): string {
    if (item === 'spacer' || item === 'loading') {
      return item;
    }
    if (item instanceof ApolloError) {
      return 'error';
    }
    return item._id;
  }

  function onEndReached(data: ListOfAidRequestsQuery): void {
    if (!data.allAidRequests?.pageInfo.hasNextPage || loading) {
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

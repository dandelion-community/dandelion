import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import Text from 'src/client/components/Text';
import { ListOfAidRequestsQuery_allAidRequests_edges_node } from 'src/client/request_explorer/__generated__/ListOfAidRequestsQuery';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';
import filterNulls from 'src/shared/utils/filterNulls';
import type { FilterContext } from './FilterContext';
import type { FilterButtonProps } from './RequestExplorerFilterButton';
import RequestExplorerFilterButton from './RequestExplorerFilterButton';
import type { FilterType } from './RequestExplorerFiltersContext';
import { useRequestExplorerFilters } from './RequestExplorerFiltersContext';

export const FILTERS: FilterButtonProps[] = [
  {
    getCurrentToggleState: (filter: FilterType): boolean => {
      return filter?.iAmWorkingOnIt === true;
    },
    label: 'Me',
    passes: (
      filter: FilterType,
      aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
      { viewerID }: FilterContext,
    ): boolean => {
      if (!('iAmWorkingOnIt' in filter)) {
        return true;
      }
      const { iAmWorkingOnIt } = filter;
      if (iAmWorkingOnIt == null) {
        return true;
      }
      const { whoIsWorkingOnItUsers: aidReqeustUsers } = aidRequest;
      return (
        iAmWorkingOnIt ===
        filterNulls(aidReqeustUsers ?? []).some(
          ({ _id: userWorkingOnTheRequest }) =>
            userWorkingOnTheRequest === viewerID,
        )
      );
    },
    toggleOff: (filter: FilterType): FilterType => {
      const { iAmWorkingOnIt: _iAmWorkingOnIt, ...rest } = filter;
      _iAmWorkingOnIt;
      return rest;
    },
    toggleOn: (filter: FilterType): FilterType => {
      return { ...filter, iAmWorkingOnIt: true };
    },
  },
  {
    getCurrentToggleState: (filter: FilterType): boolean => {
      return filter?.completed === true;
    },
    label: 'Closed',
    passes: (
      filter: FilterType,
      aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
    ): boolean => {
      const filterCompleted = filter.completed;
      if (filterCompleted == null) {
        console.error('Unexpected null filter.completed');
        return true;
      }
      const aidRequestCompleted = aidRequest.completed;
      if (aidRequestCompleted == null) {
        console.error('Unexpected null aidRequest.completed');
        return false;
      }
      return filterCompleted === aidRequestCompleted;
    },
    toggleOff: (filter: FilterType): FilterType => {
      return { ...filter, completed: false };
    },
    toggleOn: (filter: FilterType): FilterType => {
      return { ...filter, completed: true };
    },
  },
];

export default function RequestExplorerFilters(): JSX.Element {
  const { filter } = useRequestExplorerFilters();
  const { id: viewerID } = useLoggedInViewer();
  const context = { viewerID };
  return (
    <View style={styles.container}>
      <FlatList
        data={FILTERS}
        horizontal={true}
        keyExtractor={({ label }) => label}
        renderItem={renderItem}
      />
      <Text>
        {getFilterDescription(
          FILTERS[0].getCurrentToggleState(filter, context),
          FILTERS[1].getCurrentToggleState(filter, context),
        )}
      </Text>
    </View>
  );

  function renderItem({
    item,
    index: _index,
    separators: _separators,
  }: ListRenderItemInfo<FilterButtonProps>): React.ReactElement | null {
    return <RequestExplorerFilterButton {...item} />;
  }
}

function getFilterDescription(
  isMeEnabled: boolean,
  isCompletedEnabled: boolean,
): string {
  if (isMeEnabled) {
    if (isCompletedEnabled) {
      return 'Closed requests I worked on';
    } else {
      return "Open requests I'm working on";
    }
  } else {
    // me disabled
    if (isCompletedEnabled) {
      return 'All closed requests';
    } else {
      return 'All open requests';
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    borderBottomColor: '#333',
    borderBottomWidth: 3,
    flexGrow: 0,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

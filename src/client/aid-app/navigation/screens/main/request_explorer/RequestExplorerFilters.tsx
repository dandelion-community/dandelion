import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListOfAidRequestsQuery_allAidRequests_edges_node } from '../../../../aid_requests/__generated__/ListOfAidRequestsQuery';
import type { FilterType } from './filters/RequestExplorerFiltersContext';
import type {
  FilterButtonProps,
  FilterContext,
} from './RequestExplorerFilterButton';
import RequestExplorerFilterButton from './RequestExplorerFilterButton';

export const FILTERS: FilterButtonProps[] = [
  {
    getCurrentToggleState: (
      filter: FilterType,
      { viewerID }: FilterContext,
    ): boolean => {
      return (filter?.whoIsWorkingOnIt ?? []).includes(viewerID);
    },
    label: 'Me',
    passes: (
      filter: FilterType,
      aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
    ): boolean => {
      if (!('whoIsWorkingOnIt' in filter)) {
        return true;
      }
      const { whoIsWorkingOnIt: filterUserIDs } = filter;
      const { whoIsWorkingOnItUsers: aidReqeustUsers } = aidRequest;
      if (filterUserIDs == null || aidReqeustUsers == null) {
        return (
          (filterUserIDs ?? []).length === 0 &&
          (aidReqeustUsers ?? []).length === 0
        );
      }
      return aidReqeustUsers.some(
        (user) => user != null && filterUserIDs.includes(user?._id),
      );
    },
    toggleOff: (filter: FilterType): FilterType => {
      const { whoIsWorkingOnIt: _whoIsWorkingOnIt, ...rest } = filter;
      _whoIsWorkingOnIt;
      return rest;
    },
    toggleOn: (filter: FilterType, { viewerID }: FilterContext): FilterType => {
      return { ...filter, whoIsWorkingOnIt: [viewerID] };
    },
  },
  {
    getCurrentToggleState: (filter: FilterType): boolean => {
      return filter?.completed === true;
    },
    label: 'Completed',
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
  return (
    <View style={styles.container}>
      <FlatList
        data={FILTERS}
        horizontal={true}
        keyExtractor={({ label }) => label}
        renderItem={renderItem}
      />
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

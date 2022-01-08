import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import type { FilterType } from './filters/RequestExplorerFiltersContext';
import type {
  FilterButtonProps,
  FilterContext,
} from './RequestExplorerFilterButton';
import RequestExplorerFilterButton from './RequestExplorerFilterButton';

const FILTERS: FilterButtonProps[] = [
  {
    getCurrentToggleState: (
      filter: FilterType,
      { viewerID }: FilterContext,
    ): boolean => {
      return (filter?.whoIsWorkingOnIt ?? []).includes(viewerID);
    },
    label: 'Me',
    toggleOff: (filter: FilterType): FilterType => {
      if (filter == null) {
        return null;
      }
      return { ...filter, whoIsWorkingOnIt: null };
    },
    toggleOn: (filter: FilterType, { viewerID }: FilterContext): FilterType => {
      return { ...(filter ?? {}), whoIsWorkingOnIt: [viewerID] };
    },
  },
  {
    getCurrentToggleState: (filter: FilterType): boolean => {
      return filter?.completed === true;
    },
    label: 'Completed',
    toggleOff: (filter: FilterType): FilterType => {
      return { ...(filter ?? {}), completed: false };
    },
    toggleOn: (filter: FilterType): FilterType => {
      return { ...(filter ?? {}), completed: true };
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

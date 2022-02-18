import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FilterContext } from 'src/client/aid_request/filter/FilterContext';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import { useRequestExplorerFilters } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import { ListOfAidRequestsQuery_allAidRequests_edges_node } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import Text from 'src/client/components/Text';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';

type UpdateFilter = (
  oldFilter: FilterType,
  context: FilterContext,
) => FilterType;

export type FilterButtonProps = {
  getCurrentToggleState: (
    filter: FilterType,
    context: FilterContext,
  ) => boolean;
  label: string;
  passes: (
    filter: FilterType,
    aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
    context: FilterContext,
  ) => boolean;
  toggleOff: UpdateFilter;
  toggleOn: UpdateFilter;
};

export default function RequestExplorerFilterButton({
  getCurrentToggleState,
  label,
  toggleOff,
  toggleOn,
}: FilterButtonProps): React.ReactElement {
  const { filter, setFilters } = useRequestExplorerFilters();
  const { id: viewerID } = useLoggedInViewer();
  const context = { viewerID };
  const enabled = getCurrentToggleState(filter, context);
  const theme = useColorScheme();
  const style = [
    styles.container,
    theme === 'light' ? styles.containerLight : styles.containerDark,
    ...(enabled ? [theme === 'light' ? styles.onLight : styles.onDark] : []),
  ];
  return (
    <Pressable onPress={onPress}>
      <View style={style}>
        <Text>{label}</Text>
      </View>
    </Pressable>
  );

  function onPress(): void {
    if (enabled) {
      setFilters(toggleOff(filter, context));
    } else {
      setFilters(toggleOn(filter, context));
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    margin: 2,
    padding: 6,
  },
  containerDark: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  containerLight: {
    backgroundColor: '#bbb',
    borderColor: '#b5b5b5',
  },
  onDark: {
    borderColor: '#bbb',
  },
  onLight: {
    borderColor: '#333',
  },
});

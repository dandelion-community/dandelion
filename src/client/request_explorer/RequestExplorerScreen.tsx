import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import ListOfRequests from 'src/client/request_explorer/ListOfAidRequests';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import RequestExplorerFilters from './RequestExplorerFilters';
import type { FilterType } from './RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from './RequestExplorerFiltersContext';

export default function RequestExplorerScreen(): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);

  return (
    <RequireLoggedInScreen>
      <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
        <View style={styles.container}>
          <RequestExplorerFilters />
          <ListOfRequests />
        </View>
      </RequestExplorerFiltersContext.Provider>
    </RequireLoggedInScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
});

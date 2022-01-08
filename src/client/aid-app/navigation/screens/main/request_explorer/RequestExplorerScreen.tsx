import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import RequireLoggedInScreen from '../../../../../general-purpose/components/RequireLoggedInScreen';
import ListOfRequests from '../../../../aid_requests/ListOfAidRequests';
import type { FilterType } from './filters/RequestExplorerFiltersContext';
import { RequestExplorerFiltersContext } from './filters/RequestExplorerFiltersContext';
import RequestExplorerFilters from './RequestExplorerFilters';

export default function RequestExplorerScreen(): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>({ completed: false });

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

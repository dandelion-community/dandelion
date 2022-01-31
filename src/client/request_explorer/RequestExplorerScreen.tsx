import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import ListOfRequests from 'src/client/request_explorer/ListOfAidRequests';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import { RequestExplorerStackScreenProps } from '../navigation/NavigationTypes';
import RequestExplorerFilters from './RequestExplorerFilters';
import type { FilterType } from './RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from './RequestExplorerFiltersContext';

export default function RequestExplorerScreen({
  navigation,
}: RequestExplorerStackScreenProps<'RequestExplorer'>): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);

  return (
    <RequireLoggedInScreen>
      <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
        <View style={styles.container}>
          <RequestExplorerFilters />
          <ListOfRequests goToRequestDetailScreen={goToRequestDetailScreen} />
        </View>
      </RequestExplorerFiltersContext.Provider>
    </RequireLoggedInScreen>
  );

  function goToRequestDetailScreen(aidRequestID: string): void {
    navigation.push('AidRequestDetail', { id: aidRequestID });
  }
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

import * as React from 'react';
import { StyleSheet } from 'react-native';
import RequestExplorerFilters from 'src/client/aid_request/filter/RequestExplorerFilters';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import ListOfRequests from 'src/client/aid_request/list/ListOfAidRequests';
import View from 'src/client/components/View';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

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

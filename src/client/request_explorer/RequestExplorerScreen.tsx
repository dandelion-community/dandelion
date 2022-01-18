import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import { HomeStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ListOfRequests from 'src/client/request_explorer/ListOfAidRequests';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import RequestExplorerFilters from './RequestExplorerFilters';
import type { FilterType } from './RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from './RequestExplorerFiltersContext';

type Props = HomeStackScreenProps<'RequestExplorer'>;

export default function RequestExplorerScreen({
  navigation,
}: Props): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);

  return (
    <RequireLoggedInScreen>
      <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
        <View style={styles.container}>
          <RequestExplorerFilters />
          <ListOfRequests viewRequestHistory={viewRequestHistory} />
        </View>
      </RequestExplorerFiltersContext.Provider>
    </RequireLoggedInScreen>
  );

  function viewRequestHistory(requestID: string): void {
    navigation.navigate('RequestHistory', { requestID });
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

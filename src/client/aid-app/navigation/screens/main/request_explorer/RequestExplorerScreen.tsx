import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import RequireLoggedInScreen from '../../../../../general-purpose/components/RequireLoggedInScreen';
import ListOfRequests from '../../../../aid_requests/ListOfAidRequests';
import { HomeStackScreenProps } from '../../../NavigationTypes';
import type { FilterType } from './filters/RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from './filters/RequestExplorerFiltersContext';
import RequestExplorerFilters from './RequestExplorerFilters';

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

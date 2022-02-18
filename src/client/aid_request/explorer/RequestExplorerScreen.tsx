import * as React from 'react';
import RequestExplorerFilters from 'src/client/aid_request/filter/RequestExplorerFilters';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import ListOfRequests from 'src/client/aid_request/list/ListOfAidRequests';
import ScrollableScreen from 'src/client/components/ScrollableScreen';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

export default function RequestExplorerScreen({
  navigation,
}: RequestExplorerStackScreenProps<'RequestExplorer'>): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);

  return (
    <RequireLoggedInScreen>
      <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
        <ScrollableScreen>
          <RequestExplorerFilters />
          <ListOfRequests goToRequestDetailScreen={goToRequestDetailScreen} />
        </ScrollableScreen>
      </RequestExplorerFiltersContext.Provider>
    </RequireLoggedInScreen>
  );

  function goToRequestDetailScreen(aidRequestID: string): void {
    navigation.push('AidRequestDetail', { id: aidRequestID });
  }
}

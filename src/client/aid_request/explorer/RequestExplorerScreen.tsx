import * as React from 'react';
import useSetRequestExplorerNavigation from 'src/client/aid_request/explorer/navigation/useSetRequestExplorerNavigation';
import RequestExplorerFilters from 'src/client/aid_request/filter/RequestExplorerFilters';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import {
  DEFAULT_FILTER,
  RequestExplorerFiltersContext,
} from 'src/client/aid_request/filter/RequestExplorerFiltersContext';
import useListOfAidRequestItems from 'src/client/aid_request/list/useListOfAidRequestItems';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

export default function RequestExplorerScreen({
  navigation,
}: RequestExplorerStackScreenProps<'RequestExplorer'>): JSX.Element {
  useSetRequestExplorerNavigation(navigation);
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);

  return (
    <RequireLoggedInScreen>
      <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
        <RequestExplorerScreenLoggedInImpl
          goToRequestDetailScreen={goToRequestDetailScreen}
        />
      </RequestExplorerFiltersContext.Provider>
    </RequireLoggedInScreen>
  );

  function goToRequestDetailScreen(aidRequestID: string): void {
    navigation.push('AidRequestDetail', { id: aidRequestID });
  }
}

type InnerProps = {
  goToRequestDetailScreen: (aidRequestID: string) => void;
};

function RequestExplorerScreenLoggedInImpl({
  goToRequestDetailScreen,
}: InnerProps): React.ReactElement {
  const listOfAidRequests = useListOfAidRequestItems({
    goToRequestDetailScreen,
  });
  return (
    <ScrollableScreen
      configs={[
        singleElement({
          key: 'RequestExplorerFilters',
          render: () => <RequestExplorerFilters />,
        }),
        listOfAidRequests,
      ]}
    />
  );
}

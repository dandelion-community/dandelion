import * as React from 'react';
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
import AID_REQUEST_DETAIL_ID_URL_PARAM from 'src/shared/urls/AID_REQUEST_DETAIL_ID_URL_PARAM';

export default function RequestExplorerScreen({
  navigation,
}: RequestExplorerStackScreenProps<'RequestExplorer'>): JSX.Element {
  const [filter, setFilters] = React.useState<FilterType>(DEFAULT_FILTER);
  const listOfAidRequests = useListOfAidRequestItems({
    filter,
    goToRequestDetailScreen,
  });

  return (
    <RequestExplorerFiltersContext.Provider value={{ filter, setFilters }}>
      <ScrollableScreen
        configs={[
          singleElement({
            key: 'RequestExplorerFilters',
            render: () => <RequestExplorerFilters />,
          }),
          listOfAidRequests,
        ]}
      />
    </RequestExplorerFiltersContext.Provider>
  );

  function goToRequestDetailScreen(aidRequestID: string): void {
    navigation.push('AidRequestDetail', {
      [AID_REQUEST_DETAIL_ID_URL_PARAM]: aidRequestID,
    });
  }
}

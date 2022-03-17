import * as React from 'react';
import * as FilterEncoder from 'src/client/aid_request/filter/FilterEncoder';
import RequestExplorerFilters from 'src/client/aid_request/filter/RequestExplorerFilters';
import useListOfAidRequestItems from 'src/client/aid_request/list/useListOfAidRequestItems';
import { RequestExplorerStackScreenProps } from 'src/client/navigation/NavigationTypes';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import useStore from 'src/client/store/useStore';
import AID_REQUEST_DETAIL_ID_URL_PARAM from 'src/shared/urls/AID_REQUEST_DETAIL_ID_URL_PARAM';
import RequestExplorerFiltersStore from '../filter/RequestExplorerFiltersStore';

export default function RequestExplorerScreen({
  navigation,
  route,
}: RequestExplorerStackScreenProps<'RequestExplorer'>): JSX.Element {
  React.useEffect(() => {
    RequestExplorerFiltersStore.update(FilterEncoder.decode(route.params?.f));
  }, []);
  const filter = useStore(RequestExplorerFiltersStore);
  React.useEffect(() => {
    const encoded = FilterEncoder.encode(filter);
    if (encoded !== route.params?.f) {
      navigation.replace('RequestExplorer', { f: encoded });
    }
  }, [filter]);
  const listOfAidRequests = useListOfAidRequestItems({
    filter,
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

  function goToRequestDetailScreen(aidRequestID: string): void {
    navigation.push('AidRequestDetail', {
      [AID_REQUEST_DETAIL_ID_URL_PARAM]: aidRequestID,
    });
  }
}

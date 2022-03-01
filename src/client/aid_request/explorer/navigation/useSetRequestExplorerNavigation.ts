import * as React from 'react';
import {
  RequestExplorerNavigationTypeParameterized,
  RequestExplorerStackParamList,
} from 'src/client/navigation/NavigationTypes';
import RequestExplorerNavigationStore from './RequestExplorerNavigationStore';

export default function useSetRequestExplorerNavigation<
  T extends keyof RequestExplorerStackParamList,
>(navigation: RequestExplorerNavigationTypeParameterized<T>): void {
  React.useEffect(() => {
    RequestExplorerNavigationStore.update(navigation);
  }, [navigation]);
}

import * as React from 'react';
import RootNavigationStore from 'src/client/navigation/RootNavigationStore';
import {
  RootNavigationTypeParameterized,
  RootStackParamList,
} from './NavigationTypes';

export default function useSetRootNavigation<
  T extends keyof RootStackParamList,
>(navigation: RootNavigationTypeParameterized<T>): void {
  React.useEffect(() => {
    RootNavigationStore.update(navigation);
  }, [navigation]);
}

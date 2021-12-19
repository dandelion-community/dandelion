import * as React from 'react';
import { RootNavigationAllTypes } from './NavigationTypes';
import useRootNavigatorContext from './useRootNavigatorContext';

export default function useSetRootNavigation(
  navigation: NonNullable<RootNavigationAllTypes>,
): void {
  const { setRootNavigation } = useRootNavigatorContext();
  React.useEffect(() => {
    setRootNavigation(navigation);
  }, [setRootNavigation, navigation]);
}

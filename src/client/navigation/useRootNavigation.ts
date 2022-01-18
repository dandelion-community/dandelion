import type { RootNavigationAllTypes } from './NavigationTypes';
import useRootNavigatorContext from './useRootNavigatorContext';

export default function useRootNavigation(): NonNullable<RootNavigationAllTypes> {
  const { rootNavigation } = useRootNavigatorContext();
  if (rootNavigation == null) {
    throw new Error(
      'Each direct child screen of Navigation.tsx must call useSetRootNavigation(navigation);',
    );
  }
  return rootNavigation;
}

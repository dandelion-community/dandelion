import type { RootNavigationAllTypes } from 'src/client/navigation/NavigationTypes';
import RootNavigationStore from 'src/client/navigation/RootNavigationStore';
import useStore from 'src/client/store/useStore';

export default function useRootNavigation(): NonNullable<RootNavigationAllTypes> {
  const rootNavigation = useStore(RootNavigationStore);
  if (rootNavigation == null) {
    throw new Error(
      'Each direct child screen of Navigation.tsx must call useSetRootNavigation(navigation);',
    );
  }
  return rootNavigation;
}

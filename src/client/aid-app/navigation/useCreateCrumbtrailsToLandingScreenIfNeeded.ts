import * as React from 'react';
import { setInitialTab } from '../screens/MainScreen';
import type {
  RootStackParamList,
  RootStackScreenProps,
  RootTabParamList,
} from './NavigationTypes';

type TabName = keyof RootTabParamList;

export default function useCreateCrumbtrailsToLandingScreenIfNeeded<
  Screen extends keyof RootStackParamList,
>({ navigation, route }: RootStackScreenProps<Screen>, landing: TabName): void {
  React.useEffect(() => {
    const state = navigation.getState();
    if (!navigation.canGoBack()) {
      // Landed here on a deep link. Let's put a top-level screen behind our
      // current screen so we can get a "back" button to it.
      setInitialTab?.(landing);
      navigation.replace('Main');
      // Type parameters are not working properly here, idk why
      navigation.push(route.name as any);
    }
  }, []);
}

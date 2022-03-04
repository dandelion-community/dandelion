import * as React from 'react';
import type {
  RootStackParamList,
  RootStackScreenProps,
} from '../NavigationTypes';

export default function useCreateCrumbtrailsToLandingScreenIfNeeded<
  Screen extends keyof RootStackParamList,
>(
  { navigation, route }: RootStackScreenProps<Screen>,
  rePushParams?: RootStackParamList[Screen],
): void {
  React.useEffect(() => {
    if (!navigation.canGoBack()) {
      // Landed here on a deep link. Let's put a top-level screen behind our
      // current screen so we can get a "back" button to it.
      navigation.replace('Main');
      navigation.push(route.name, rePushParams);
    }
  }, []);
}

import * as React from 'react';
import { RootNavigationContextType } from './NavigationTypes';
import RootNavigationContext from './RootNavigationContext';

export default function useRootNavigatorContext(): RootNavigationContextType {
  const value = React.useContext(RootNavigationContext);
  if (value == null) {
    throw new Error(
      'useRootNavigatorContext can only be used in descendants of Navigation.tsx',
    );
  }
  return value;
}

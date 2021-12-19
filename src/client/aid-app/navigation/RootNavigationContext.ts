import * as React from 'react';
import { RootNavigationContextType } from './NavigationTypes';

const RootNavigationContext =
  React.createContext<RootNavigationContextType | null>(null);

export default RootNavigationContext;

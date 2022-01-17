import * as React from 'react';
import type { DrawerContextType } from './DrawerContext';
import DrawerContext from './DrawerContext';

export default function useDrawerContext(): DrawerContextType {
  return React.useContext(DrawerContext);
}

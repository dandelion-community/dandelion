import * as React from 'react';
import type { DrawerContextType } from './DrawerContext';
import DrawerContext from './DrawerContext';

export default function useDrawerOpener(): DrawerContextType {
  return React.useContext(DrawerContext);
}

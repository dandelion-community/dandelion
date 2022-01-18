import type { DrawerContextType } from 'drawer/DrawerContext';
import DrawerContext from 'drawer/DrawerContext';
import * as React from 'react';

export default function useDrawerContext(): DrawerContextType {
  return React.useContext(DrawerContext);
}

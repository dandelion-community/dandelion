import * as React from 'react';
import type { DrawerContextType } from 'src/client/drawer/DrawerContext';
import DrawerContext from 'src/client/drawer/DrawerContext';

export default function useDrawerContext(): DrawerContextType {
  return React.useContext(DrawerContext);
}

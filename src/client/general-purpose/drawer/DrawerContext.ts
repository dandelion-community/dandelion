import * as React from 'react';

export type DrawerContextType = {
  closeDrawer: () => void;
  openDrawer: (render: () => React.ReactElement) => void;
};

const DrawerContext = React.createContext<DrawerContextType>({
  closeDrawer: () => {
    console.error('Attempted to close drawer outside of a DrawerContext');
  },
  openDrawer: () => {
    console.error('Attempted to open drawer outside of a DrawerContext');
  },
});

export default DrawerContext;

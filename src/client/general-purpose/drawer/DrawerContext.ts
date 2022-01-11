import * as React from 'react';

export type DrawerContextType = {
  openDrawer: (render: () => React.ReactElement) => void;
};

const DrawerContext = React.createContext<DrawerContextType>({
  openDrawer: () => {
    console.error('Attempted to open drawer outside of a DrawerContext');
  },
});

export default DrawerContext;

import * as React from 'react';

export type DialogContextType = {
  shouldDelete: () => Promise<boolean>;
};

const DialogContext = React.createContext<DialogContextType>({
  shouldDelete: async (): Promise<boolean> => {
    console.error('Attempted to call shouldDelete outside of a DialogContext');
    return false;
  },
});

export default DialogContext;

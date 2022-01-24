import * as React from 'react';

export type ToastConfig = {
  message: string;
  undo?: null | (() => Promise<void>);
};

export type ToastContextType = {
  publishToast: (config: ToastConfig | undefined) => void;
};

const ToastContext = React.createContext<ToastContextType>({
  publishToast: () => {
    console.error('Attempted to publish toast outside of a ToastContext');
  },
});

export default ToastContext;

import * as React from 'react';
import reportError from 'src/client/error/reportError';

export type ToastConfig = {
  message: string;
  undo?: null | (() => Promise<void>);
};

export type ToastContextType = {
  publishToast: (config: ToastConfig | undefined) => void;
};

const ToastContext = React.createContext<ToastContextType>({
  publishToast: () => {
    reportError('Attempted to publish toast outside of a ToastContext');
  },
});

export default ToastContext;

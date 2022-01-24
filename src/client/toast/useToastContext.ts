import * as React from 'react';
import type { ToastContextType } from './ToastContext';
import ToastContext from './ToastContext';

export default function useToastContext(): ToastContextType {
  return React.useContext(ToastContext);
}

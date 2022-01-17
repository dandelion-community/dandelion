import * as React from 'react';
import type { DialogContextType } from './DialogContext';
import DialogContext from './DialogContext';

export default function useDialogContext(): DialogContextType {
  return React.useContext(DialogContext);
}

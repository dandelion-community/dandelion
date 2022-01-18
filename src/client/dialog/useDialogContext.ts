import type { DialogContextType } from 'dialog/DialogContext';
import DialogContext from 'dialog/DialogContext';
import * as React from 'react';

export default function useDialogContext(): DialogContextType {
  return React.useContext(DialogContext);
}

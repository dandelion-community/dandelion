import * as React from 'react';
import type { DialogContextType } from 'src/client/dialog/DialogContext';
import DialogContext from 'src/client/dialog/DialogContext';

export default function useDialogContext(): DialogContextType {
  return React.useContext(DialogContext);
}

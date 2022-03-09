import React from 'react';
import PinnedInputProvider from 'src/client/global/pinned_input/PinnedInputProvider';
import DialogProvider from 'src/client/dialog/DialogProvider';
import DrawerProvider from 'src/client/drawer/DrawerProvider';
import ToastProvider from 'src/client/toast/ToastProvider';
import type { ChildrenPropsType } from 'src/client/utils/ChildrenPropsType';
import useLoadViewer from 'src/client/viewer/useLoadViewer';

export default function RootLevelComponents({
  children,
}: ChildrenPropsType): React.ReactElement {
  useLoadViewer();
  return (
    <PinnedInputProvider>
      <DialogProvider>
        <ToastProvider>
          <DrawerProvider>{children}</DrawerProvider>
        </ToastProvider>
      </DialogProvider>
    </PinnedInputProvider>
  );
}

import React from 'react';
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
    <DialogProvider>
      <ToastProvider>
        <DrawerProvider>{children}</DrawerProvider>
      </ToastProvider>
    </DialogProvider>
  );
}

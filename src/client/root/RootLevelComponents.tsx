import React from 'react';
import DialogProvider from 'src/client/dialog/DialogProvider';
import DrawerProvider from 'src/client/drawer/DrawerProvider';
import ToastProvider from 'src/client/toast/ToastProvider';
import type { ChildrenPropsType } from 'src/client/utils/ChildrenPropsType';

export default function GlobalProviders({
  children,
}: ChildrenPropsType): React.ReactElement {
  return (
    <DialogProvider>
      <ToastProvider>
        <DrawerProvider>{children}</DrawerProvider>
      </ToastProvider>
    </DialogProvider>
  );
}

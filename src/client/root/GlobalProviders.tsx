import React from 'react';
import SearchProvider from 'src/client/search/SearchProvider';
import DialogProvider from 'src/client/dialog/DialogProvider';
import DrawerProvider from 'src/client/drawer/DrawerProvider';
import ToastProvider from 'src/client/toast/ToastProvider';

export default function GlobalProviders({
  children,
}: {
  children: React.ReactChild[];
}): React.ReactElement {
  return (
    <DialogProvider>
      <ToastProvider>
        <DrawerProvider>
          <SearchProvider>{children}</SearchProvider>
        </DrawerProvider>
      </ToastProvider>
    </DialogProvider>
  );
}

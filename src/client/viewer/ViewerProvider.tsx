import * as React from 'react';
import useLoadViewer from 'src/client/viewer/useLoadViewer';
import ViewerContext from 'src/client/viewer/ViewerContext';

type Props = {
  children: React.ReactChild;
};

export default function ViewerProvider({
  children,
}: Props): React.ReactElement {
  const viewer = useLoadViewer();
  return (
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
  );
}

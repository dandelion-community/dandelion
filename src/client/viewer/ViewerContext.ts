import * as React from 'react';
import Loading from 'src/client/utils/loading/Loading';
import type { LoggedInViewer, Viewer } from './ViewerTypes';

const ViewerContext = React.createContext<Viewer>(Loading);

export default ViewerContext;

export function useViewerContext(): Viewer {
  return React.useContext(ViewerContext);
}

export function useLoggedInViewer(): LoggedInViewer {
  const viewer = useViewerContext();
  if (viewer === undefined || viewer === Loading) {
    throw new Error('Only call useLoggedInViewer when the viewer is logged in');
  }
  return viewer;
}

export function useLoggedInViewerID(): string {
  const viewer = useLoggedInViewer();
  return viewer.id;
}

export function useViewerUsername(): string {
  const { username } = useLoggedInViewer();
  return username;
}

export function useIsLoadingLoggedInStatus(): boolean {
  const viewer = useViewerContext();
  return viewer === Loading;
}

export function useIsLoggedOut(): boolean {
  const viewer = useViewerContext();
  return viewer === undefined;
}

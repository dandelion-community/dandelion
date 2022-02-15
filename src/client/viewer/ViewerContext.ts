import * as React from 'react';
import type { LoadingType } from 'src/client/utils/loading/Loading';
import Loading from 'src/client/utils/loading/Loading';

export type LoggedInViewer = Readonly<{
  crews: string[];
  displayName: string;
  id: string;
  username: string;
}>;

export type LoggedOutViewer = Readonly<{
  crews: undefined;
  displayName: undefined;
  id: undefined;
  username: undefined;
}>;

export type LoadingViewer = Readonly<{
  crews: LoadingType;
  displayName: LoadingType;
  id: LoadingType;
  username: LoadingType;
}>;

export type Viewer = Readonly<LoggedInViewer | LoggedOutViewer | LoadingViewer>;

const ViewerContext = React.createContext<Viewer>({
  crews: Loading,
  displayName: Loading,
  id: Loading,
  username: Loading,
});

export default ViewerContext;

export function useViewerContext(): Viewer {
  return React.useContext(ViewerContext);
}

export function useLoggedInViewer(): LoggedInViewer {
  const viewer = useViewerContext();
  if (viewer.username == null || viewer.username === Loading) {
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
  return viewer.username === Loading;
}

export function useIsLoggedOut(): boolean {
  const viewer = useViewerContext();
  return viewer.username == null;
}

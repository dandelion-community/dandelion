import createStore from 'src/client/store/createStore';
import useStore from 'src/client/store/useStore';
import Loading from 'src/client/utils/loading/Loading';
import type { LoggedInViewer, Viewer } from 'src/client/viewer/ViewerTypes';

export const ViewerStore = createStore<Viewer>(Loading);

export function useViewer(): Viewer {
  return useStore(ViewerStore);
}

export function useLoggedInViewer(): LoggedInViewer {
  const viewer = useViewer();
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
  const viewer = useViewer();
  return viewer === Loading;
}

export function useIsLoggedOut(): boolean {
  const viewer = useViewer();
  return viewer === undefined;
}

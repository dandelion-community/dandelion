import * as React from 'react';
import type { LoadingType } from '../utils/loading';
import Loading from '../utils/loading';

export type LoggedInViewer = Readonly<{
  username: string;
}>;

export type LoggedOutViewer = Readonly<{
  username: undefined;
}>;

export type LoadingViewer = Readonly<{
  username: LoadingType;
}>;

export type Viewer = Readonly<LoggedInViewer | LoggedOutViewer | LoadingViewer>;

const ViewerContext = React.createContext<Viewer>({
  username: Loading,
});

export default ViewerContext;

export function useViewerContext(): Viewer {
  return React.useContext(ViewerContext);
}

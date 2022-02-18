import type { LoadingType } from 'src/client/utils/loading/Loading';

export type LoggedInViewer = Readonly<{
  crews: string[];
  displayName: string;
  id: string;
  username: string;
}>;

export type LoggedOutViewer = undefined;

export type LoadingViewer = LoadingType;

export type Viewer = LoggedInViewer | LoggedOutViewer | LoadingViewer;

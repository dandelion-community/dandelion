import { useLoggedInViewerID } from 'src/client/viewer/Viewer';

export type FilterContext = {
  viewerID: string;
};

export function useFilterContext(): FilterContext {
  const viewerID = useLoggedInViewerID();
  return { viewerID };
}

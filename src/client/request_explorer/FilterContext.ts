import { useLoggedInViewerID } from '../viewer/ViewerContext';

export type FilterContext = {
  viewerID: string;
};

export function useFilterContext(): FilterContext {
  const viewerID = useLoggedInViewerID();
  return { viewerID };
}

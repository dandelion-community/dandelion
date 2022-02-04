import * as React from 'react';
import * as AidRequestDraftsStore from 'src/client/aid_request/drafts/AidRequestDraftsStore';
import type { FilterType } from 'src/client/request_explorer/RequestExplorerFiltersContext';
import { useLoggedInViewerID } from 'src/client/viewer/ViewerContext';
import { FilterContext } from '../../request_explorer/RequestExplorerFilterButton';
import { ListOfAidRequestsQuery } from '../../request_explorer/__generated__/ListOfAidRequestsQuery';
import { broadcastManyNewAidRequests } from './broadcastAidRequestUpdates';
import LocalUpdateSubscriberStore from './LocalUpdateSubscriberStore';

export default function useSubscribeToLocalUpdates(
  filter: FilterType,
  data: ListOfAidRequestsQuery | undefined,
  loading: boolean,
): void {
  const viewerID = useLoggedInViewerID();
  React.useEffect(() => {
    if (data != null && !loading) {
      // Using setTimeout here avoids a bug where filter has changed but
      // data (returned from useQuery in ListOfAidRequests) still has the
      // value from the old filter. If this happened without setTimeout,
      // we would insert the old data into the cache entry for the new filter.
      // setTimeout delays the call to broadcastManyNewAidRequests until
      // both filter and data have updated to the new values.
      const timeoutID = setTimeout(() =>
        subscribeQueryToAidRequestUpdates(filter, data, { viewerID }),
      );
      return () => clearTimeout(timeoutID);
    }
  }, [filter, data, viewerID, loading]);
}

function subscribeQueryToAidRequestUpdates(
  filter: FilterType,
  data: ListOfAidRequestsQuery,
  filterContext: FilterContext,
): void {
  LocalUpdateSubscriberStore.add({ data, filter, filterContext });
  broadcastManyNewAidRequests(AidRequestDraftsStore.getGraphQLValues());
}

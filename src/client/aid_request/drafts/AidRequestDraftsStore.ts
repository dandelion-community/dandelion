import * as React from 'react';
import {
  setSavedValuesToStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/internal/AidRequestDraftsPersistentStorage';
import { CreateAidRequestsMutation_createAidRequests_requests } from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import * as AidRequestDraftsMemoryStore from './internal/AidRequestDraftsMemoryStore';

export async function setStorageValues(
  values: Array<StorageEntry>,
): Promise<void> {
  AidRequestDraftsMemoryStore.setDrafts(values);
  await setSavedValuesToStorage(values);
}

export const getStorageValues =
  AidRequestDraftsMemoryStore.getDraftsAsStorageEntries;

export const getGraphQLValues = AidRequestDraftsMemoryStore.getDraftsAsGraphQL;

export function useGraphQLValues(): CreateAidRequestsMutation_createAidRequests_requests[] {
  const [values, setValues] =
    React.useState<CreateAidRequestsMutation_createAidRequests_requests[]>(
      getGraphQLValues,
    );
  React.useEffect(() => {
    AidRequestDraftsMemoryStore.subscribe(setValues);
    return () => AidRequestDraftsMemoryStore.unsubscribe(setValues);
  }, []);
  return values;
}

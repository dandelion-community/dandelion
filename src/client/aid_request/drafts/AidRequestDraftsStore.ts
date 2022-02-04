import {
  setSavedValuesToStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/internal/AidRequestDraftsPersistentStorage';
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

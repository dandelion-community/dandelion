import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import { CreateAidRequestsMutation_createAidRequests_requests } from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import {
  getSavedValuesFromStorage,
  StorageEntry,
} from './AidRequestDraftsPersistentStorage';

let memoryDrafts: CreateAidRequestsMutation_createAidRequests_requests[] = [];
let storageDrafts: StorageEntry[] = [];

export function setDrafts(storageEntries: StorageEntry[]): void {
  storageDrafts = storageEntries;
  const inMemoryEntries = storageEntries.map(fakeGraphQLResponse);
  memoryDrafts = inMemoryEntries;
}

export function getDraftsAsGraphQL(): CreateAidRequestsMutation_createAidRequests_requests[] {
  return memoryDrafts;
}

export function getDraftsAsStorageEntries(): StorageEntry[] {
  return storageDrafts;
}

export async function initializeAidRequestDrafts(): Promise<void> {
  try {
    const savedValues = await getSavedValuesFromStorage();
    setDrafts(savedValues);
  } catch {
    console.error('Failed to initialize aid request drafts');
  }
}

function fakeGraphQLResponse({
  tempID,
  crew,
  whatIsNeeded,
  whoIsItFor,
}: StorageEntry): CreateAidRequestsMutation_createAidRequests_requests {
  return {
    __typename: 'AidRequest',
    _id: tempID,
    actionsAvailable: [
      {
        __typename: 'AidRequestActionOption',
        icon: 'delete',
        input: {
          __typename: 'AidRequestActionInput',
          action: AidRequestUpdateActionType.Add,
          event: AidRequestHistoryEventType.Deleted,
        },
        message: 'Delete',
      },
    ],
    completed: false,
    crew,
    latestEvent: 'Draft saved to device',
    whatIsNeeded,
    whoIsItFor,
    whoIsWorkingOnItUsers: [],
    whoRecordedIt: null,
  };
}

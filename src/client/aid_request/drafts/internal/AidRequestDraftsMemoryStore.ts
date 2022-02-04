import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import { CreateAidRequestsMutation_createAidRequests_requests } from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import {
  getSavedValuesFromStorage,
  StorageEntry,
} from './AidRequestDraftsPersistentStorage';

type InMemoryData = CreateAidRequestsMutation_createAidRequests_requests[];
type Subscriber = (values: InMemoryData) => void;

let memoryDrafts: InMemoryData = [];
let storageDrafts: StorageEntry[] = [];

export function setDrafts(storageEntries: StorageEntry[]): void {
  storageDrafts = storageEntries;
  const inMemoryEntries = storageEntries.map(fakeGraphQLResponse);
  memoryDrafts = inMemoryEntries;
  subscribers.forEach((subscriber) => subscriber(memoryDrafts));
}

const subscribers: Set<Subscriber> = new Set();

export function subscribe(subscriber: Subscriber): void {
  subscribers.add(subscriber);
}

export function unsubscribe(subscriber: Subscriber): void {
  subscribers.delete(subscriber);
}

export function getDraftsAsGraphQL(): InMemoryData {
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

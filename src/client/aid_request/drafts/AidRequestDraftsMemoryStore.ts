import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import { CreateAidRequestsMutation_createAidRequests_requests } from 'src/client/aid_request/create/__generated__/CreateAidRequestsMutation';
import {
  getSavedValuesFromStorage,
  setSavedValuesToStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/AidRequestDraftsPersistentStorage';
import { ListOfAidRequestsQuery_allAidRequests_edges } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';
import createStore from 'src/client/store/createStore';
import type { Store } from 'src/client/store/StoreType';

type GraphqlNodeData = CreateAidRequestsMutation_createAidRequests_requests[];
type GraphqlEdgeData = ListOfAidRequestsQuery_allAidRequests_edges[];

export const graphqlNodeDraftStore: Store<GraphqlNodeData> =
  createStore<GraphqlNodeData>([]);
export const graphqlEdgeDraftStore: Store<GraphqlEdgeData> =
  createStore<GraphqlEdgeData>([]);
export const storageDraftStore: Store<StorageEntry[]> = createStore<
  StorageEntry[]
>([]);

export async function setDrafts(storageEntries: StorageEntry[]): Promise<void> {
  storageDraftStore.update(storageEntries);
  const graphqlNodes = storageEntries.map(fakeGraphQLResponse);
  graphqlNodeDraftStore.update(graphqlNodes);
  const graphqlEdges = graphqlNodes.map(createEdgeForNode);
  graphqlEdgeDraftStore.update(graphqlEdges);
  await setSavedValuesToStorage(storageEntries);
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
    createdAt: new Date(),
    crew,
    lastUpdated: new Date(),
    latestEvent: 'Draft saved to device',
    whatIsNeeded,
    whoIsItFor,
    whoIsWorkingOnItUsers: [],
    whoRecordedIt: null,
  };
}

function createEdgeForNode(
  node: CreateAidRequestsMutation_createAidRequests_requests,
): ListOfAidRequestsQuery_allAidRequests_edges {
  return {
    __typename: 'AidRequestEdge',
    node,
  };
}

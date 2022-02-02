import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import createAidRequestSaveToServer from 'src/client/aid_request/create/createAidRequestSaveToServer';
import { createDraftID } from 'src/client/aid_request/drafts/AidRequestDraftIDs';
import {
  getSavedValuesFromStorage,
  setSavedValuesToStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/AidRequestDraftStorage';
import {
  CreateAidRequestsMutationVariables,
  CreateAidRequestsMutation_createAidRequests_requests,
} from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import {
  broadcastAidRequestUpdated,
  setDrafts,
} from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import { FilterContext } from 'src/client/request_explorer/RequestExplorerFilterButton';
import filterNulls from 'src/shared/utils/filterNulls';

export type SuccessfulSaveData = {
  postpublishSummary: string;
  aidRequests: CreateAidRequestsMutation_createAidRequests_requests[];
};

export async function saveLocally(
  variables: CreateAidRequestsMutationVariables,
): Promise<null | SuccessfulSaveData> {
  try {
    const oldValues = await getSavedValuesFromStorage();
    const newValues = createNewValues(variables);
    await setSavedValues(oldValues.concat(newValues));
    return {
      aidRequests: newValues.map(fakeGraphQLResponse),
      postpublishSummary: `Network unavailable. Saved draft${
        newValues.length === 1 ? '' : 's'
      } to device`,
    };
  } catch {
    return null;
  }
}

export async function deleteEntry(
  aidRequestID: string,
  filterContext: FilterContext,
): Promise<void> {
  try {
    const oldValues = await getSavedValuesFromStorage();
    const newValues = oldValues.filter(({ tempID }) => tempID !== aidRequestID);
    broadcastAidRequestUpdated(aidRequestID, null, filterContext);
    await setSavedValues(newValues);
  } catch {
    return;
  }
}

async function setSavedValues(values: Array<StorageEntry>): Promise<void> {
  await setSavedValuesToStorage(values);
  setDrafts(values.map(fakeGraphQLResponse));
}

function createNewValues({
  crew,
  whatIsNeeded: whatAllIsNeeded,
  whoIsItFor,
}: CreateAidRequestsMutationVariables): Array<StorageEntry> {
  return whatAllIsNeeded.map(
    (whatIsNeeded: string): StorageEntry => ({
      crew,
      tempID: createDraftID(),
      whatIsNeeded,
      whoIsItFor,
    }),
  );
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

export async function initializeAidRequestDrafts(): Promise<void> {
  try {
    const savedValues = await getSavedValuesFromStorage();
    const cacheEntries = savedValues.map(fakeGraphQLResponse);
    setDrafts(cacheEntries);
  } catch {
    console.error('Failed to initialize aid request drafts');
  }
}

export async function publishDraft(
  id: string,
  filterContext: FilterContext,
): Promise<string> {
  const oldValues = await getSavedValuesFromStorage();
  const valueToSaves = oldValues.filter(({ tempID }) => tempID === id);
  if (valueToSaves.length === 0) {
    return 'Draft data not found';
  }
  if (valueToSaves.length > 1) {
    console.error(
      'Multiple drafts found with the same ID.',
      valueToSaves,
      oldValues,
    );
  }
  const valueToSave = valueToSaves[0];
  const { crew, whoIsItFor, whatIsNeeded } = valueToSave;
  const data: null | SuccessfulSaveData = await createAidRequestSaveToServer({
    crew,
    whatIsNeeded: [whatIsNeeded],
    whoIsItFor,
  });
  if (data == null) {
    return 'Failed to publish';
  }
  await deleteEntry(id, filterContext);
  const { postpublishSummary, aidRequests } = data;
  filterNulls(aidRequests).forEach((aidRequest) => {
    broadcastAidRequestUpdated(aidRequest._id, aidRequest, filterContext);
  });
  return postpublishSummary;
}

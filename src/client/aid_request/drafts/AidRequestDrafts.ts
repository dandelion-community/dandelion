import {
  broadcastDeletedAidRequest,
  broadcastManyNewAidRequests,
} from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
import createAidRequestSaveToServer from 'src/client/aid_request/create/createAidRequestSaveToServer';
import { createDraftID } from 'src/client/aid_request/drafts/AidRequestDraftIDs';
import {
  getSavedValuesFromStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/internal/AidRequestDraftsPersistentStorage';
import {
  CreateAidRequestsMutationVariables,
  CreateAidRequestsMutation_createAidRequests_requests,
} from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import * as AidRequestDraftStore from './AidRequestDraftsStore';

export type SuccessfulSaveData = {
  postpublishSummary: string;
  aidRequests: CreateAidRequestsMutation_createAidRequests_requests[];
};

export function createNewAidRequestDraft(
  variables: CreateAidRequestsMutationVariables,
): null | SuccessfulSaveData {
  try {
    const oldValues = AidRequestDraftStore.getStorageValues();
    const newValues = createNewStorageValues(variables);
    AidRequestDraftStore.setStorageValues(oldValues.concat(newValues));
    return {
      aidRequests: AidRequestDraftStore.getGraphQLValues(),
      postpublishSummary: `Network unavailable. Saved draft${
        newValues.length === 1 ? '' : 's'
      } to device`,
    };
  } catch {
    return null;
  }
}

export function deleteAidRequestDraft(aidRequestID: string): void {
  try {
    const oldValues = AidRequestDraftStore.getStorageValues();
    const newValues = oldValues.filter(({ tempID }) => tempID !== aidRequestID);
    AidRequestDraftStore.setStorageValues(newValues);
    broadcastDeletedAidRequest(aidRequestID);
  } catch {
    return;
  }
}

function createNewStorageValues({
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

export async function publishDraft(id: string): Promise<string> {
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
  deleteAidRequestDraft(id);
  const { postpublishSummary, aidRequests } = data;
  broadcastManyNewAidRequests(aidRequests);
  return postpublishSummary;
}

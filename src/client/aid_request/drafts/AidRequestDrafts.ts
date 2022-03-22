import { broadcastManyNewAidRequests } from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
import createAidRequestSaveToServer from 'src/client/aid_request/create/createAidRequestSaveToServer';
import {
  CreateAidRequestsMutationVariables,
  CreateAidRequestsMutation_createAidRequests_requests,
} from 'src/client/aid_request/create/__generated__/CreateAidRequestsMutation';
import { createDraftID } from 'src/client/aid_request/drafts/AidRequestDraftIDs';
import {
  graphqlNodeDraftStore,
  setDrafts,
  storageDraftStore,
} from 'src/client/aid_request/drafts/AidRequestDraftsMemoryStore';
import {
  getSavedValuesFromStorage,
  StorageEntry,
} from 'src/client/aid_request/drafts/AidRequestDraftsPersistentStorage';
import flatten from 'src/shared/utils/flatten';
import resolveWhoIsItFor from 'src/shared/utils/resolveWhoIsItFor';

export type SuccessfulSaveData = {
  postpublishSummary: string;
  aidRequests: CreateAidRequestsMutation_createAidRequests_requests[];
};

export function createNewAidRequestDraft(
  variables: CreateAidRequestsMutationVariables,
): null | SuccessfulSaveData {
  try {
    const oldValues = storageDraftStore.getValue();
    const newValues = createNewStorageValues(variables);
    setDrafts(oldValues.concat(newValues));
    return {
      aidRequests: graphqlNodeDraftStore.getValue(),
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
    const oldValues = storageDraftStore.getValue();
    const newValues = oldValues.filter(({ tempID }) => tempID !== aidRequestID);
    setDrafts(newValues);
  } catch {
    return;
  }
}

function createNewStorageValues({
  crew,
  whatIsNeeded: whatAllIsNeeded,
  whoIsItFor: whoIsItForSingle,
  whoIsItForMulti,
}: CreateAidRequestsMutationVariables): Array<StorageEntry> {
  const whoAllIsItFor = resolveWhoIsItFor({
    whoIsItForMulti,
    whoIsItForSingle,
  });
  return flatten(
    whoAllIsItFor.map((whoIsItFor: string) =>
      whatAllIsNeeded.map(
        (whatIsNeeded: string): StorageEntry => ({
          crew,
          tempID: createDraftID(),
          whatIsNeeded,
          whoIsItFor,
        }),
      ),
    ),
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

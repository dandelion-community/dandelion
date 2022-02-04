import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'src/client/aid_request/drafts/AidRequestDraftStorage.ts';

export type StorageEntry = {
  tempID: string;
  crew: string;
  whatIsNeeded: string;
  whoIsItFor: string;
};

export async function getSavedValuesFromStorage(): Promise<
  Array<StorageEntry>
> {
  const rawData = await AsyncStorage.getItem(STORAGE_KEY);
  if (rawData == null) {
    return [];
  }
  try {
    const data = JSON.parse(rawData);
    const res: Array<StorageEntry> = [];
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const entry = tryToParseEntry(data[i]);
        if (entry != null) {
          res.push(entry);
        }
      }
    }
    return res;
  } catch {
    return [];
  }
}

export async function setSavedValuesToStorage(
  values: Array<StorageEntry>,
): Promise<void> {
  const serialized = JSON.stringify(values);
  await AsyncStorage.setItem(STORAGE_KEY, serialized);
}

function tryToParseEntry(entry: unknown): null | StorageEntry {
  if (typeof entry !== 'object' || entry == null) {
    return null;
  }
  const { tempID, crew, whatIsNeeded, whoIsItFor } = entry as {
    crew?: unknown;
    tempID?: unknown;
    whatIsNeeded?: unknown;
    whoIsItFor?: unknown;
  };
  if (typeof crew !== 'string') {
    return null;
  }
  if (typeof tempID !== 'string') {
    return null;
  }
  if (typeof whatIsNeeded !== 'string') {
    return null;
  }
  if (typeof whoIsItFor !== 'string') {
    return null;
  }
  return {
    crew,
    tempID,
    whatIsNeeded,
    whoIsItFor,
  };
}

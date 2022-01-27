import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import searchPrefixes from 'src/server/collections/aid_request/helpers/searchPrefixes';
import { UserModel } from 'src/server/collections/user/UserModel';

type ComputedKey =
  | 'whoIsItForSearch'
  | 'whatIsNeededSearch'
  | 'whoIsWorkingOnItSearch'
  | 'whoRecordedItSearch'
  | 'whoRecordedItUsername';

export default async function getComputedFields(
  fields: Omit<Omit<AidRequestType, ComputedKey>, '_id'>,
): Promise<Omit<Pick<AidRequestType, ComputedKey>, '_id'>> {
  const { whatIsNeeded, whoIsItFor, whoIsWorkingOnIt, whoRecordedIt } = fields;

  const whoIsWorkingOnItUsers = await Promise.all(
    whoIsWorkingOnIt.map((id) => UserModel.findById(id)),
  );
  const whoRecordedItUser = await UserModel.findById(whoRecordedIt);
  const whatIsNeededSearch = searchPrefixes(whatIsNeeded);
  const whoIsItForSearch = searchPrefixes(whoIsItFor);
  const whoIsWorkingOnItSearch = searchPrefixes(
    whoIsWorkingOnItUsers
      .filter(Boolean)
      .map((user) => user?.displayName)
      .join(' '),
  );
  const whoRecordedItSearch = searchPrefixes(
    whoRecordedItUser?.displayName ?? '',
  );
  return {
    whatIsNeededSearch,
    whoIsItForSearch,
    whoIsWorkingOnItSearch,
    whoRecordedItSearch,
    whoRecordedItUsername: whoRecordedItUser?.username || '',
  };
}

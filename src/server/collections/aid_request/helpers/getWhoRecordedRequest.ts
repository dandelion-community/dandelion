import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import { UserModel } from 'src/server/collections/user/UserModel';

export default async function getWhoRecordedRequest(
  aidRequest: AidRequestType,
): Promise<Express.User | null> {
  const { whoRecordedIt, whoRecordedItUsername } = aidRequest;
  if (whoRecordedIt != null) {
    return await UserModel.findById(whoRecordedIt);
  } else {
    return await UserModel.findOne({ username: whoRecordedItUsername });
  }
}

import { UserModel } from '../../user/UserModel';
import type { AidRequestType } from '../AidRequestModelTypes';

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

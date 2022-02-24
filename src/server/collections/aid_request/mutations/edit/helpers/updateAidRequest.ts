import type { UpdateQuery } from 'mongoose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';

export default async function updateAidRequest(
  aidRequestID: string,
  updater: UpdateQuery<AidRequestType>,
): Promise<AidRequest> {
  const aidRequest = await AidRequestModel.findByIdAndUpdate(
    aidRequestID,
    updater,
    {
      new: true,
    },
  );

  if (aidRequest == null) {
    throw new Error('Update failed');
  }

  return aidRequest;
}

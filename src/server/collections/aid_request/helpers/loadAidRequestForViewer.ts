import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';

export default async function loadAidRequestForViewer(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<AidRequest> {
  const aidRequest = await maybeLoadAidRequestForViewer(user, aidRequestID);
  if (aidRequest == null) {
    console.log('Tried to load aid request: ' + JSON.stringify(aidRequestID));
    throw new Error(
      'No request found for this ID or You do not have permission to view this aid request',
    );
  }
  return aidRequest;
}

export async function maybeLoadAidRequestForViewer(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<AidRequest | null> {
  const aidRequest = await AidRequestModel.findById(aidRequestID);
  if (aidRequest == null) {
    return null;
  }
  if (!user.crews.includes(aidRequest.crew)) {
    return null;
  }
  return aidRequest;
}

import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';

export default async function loadAidRequestForViewer(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<Document<string, unknown, AidRequestType> & AidRequestType> {
  const aidRequest = await maybeLoadAidRequestForViewer(user, aidRequestID);
  if (aidRequest == null) {
    throw new Error(
      'No request found for this ID or You do not have permission to view this aid request',
    );
  }
  return aidRequest;
}

const CACHE: Map<
  string,
  Promise<(Document<string, unknown, AidRequestType> & AidRequestType) | null>
> = new Map();

export function maybeLoadAidRequestForViewer(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<
  (Document<string, unknown, AidRequestType> & AidRequestType) | null
> {
  const cacheKey = `${user._id.toString()}~${aidRequestID ?? ''}`;
  const cachedValue = CACHE.get(cacheKey);
  if (cachedValue != null) {
    return cachedValue;
  }
  const newValue = maybeLoadAidRequestForViewerImpl(user, aidRequestID);
  CACHE.set(cacheKey, newValue);
  if (CACHE.size > 10000) {
    CACHE.clear();
  }
  return newValue;
}

async function maybeLoadAidRequestForViewerImpl(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<
  (Document<string, unknown, AidRequestType> & AidRequestType) | null
> {
  const aidRequest = await AidRequestModel.findById(aidRequestID);
  if (aidRequest == null) {
    return null;
  }
  if (!user.crews.includes(aidRequest.crew)) {
    return null;
  }
  return aidRequest;
}

import analytics from 'src/server/analytics';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';

export default async function loadAidRequestForViewer(
  viewer: Express.User,
  aidRequestID: string | undefined,
): Promise<AidRequest> {
  let result: AidRequest | Error | undefined;
  try {
    result = await loadAidRequestForViewerImpl(viewer, aidRequestID);
  } catch (e) {
    result = new Error(NON_PERMISSION_ERROR_MESSAGE);
  }
  if (!(result instanceof Error)) {
    return result;
  }
  const error = result;
  analytics.track({
    event: 'Loading aid request failed',
    properties: {
      aidRequestID: aidRequestID ?? 'undefined',
      message: error.message,
    },
    user: viewer,
  });
  throw error;
}

export async function maybeLoadAidRequestForViewer(
  viewer: Express.User,
  aidRequestID: string | undefined,
): Promise<AidRequest | undefined> {
  const result = await loadAidRequestForViewerImpl(viewer, aidRequestID);
  return result instanceof Error ? undefined : result;
}

async function loadAidRequestForViewerImpl(
  user: Express.User,
  aidRequestID: string | undefined,
): Promise<AidRequest | Error> {
  const aidRequest = await AidRequestModel.findById(aidRequestID);
  if (aidRequest == null) {
    return new Error(NON_PERMISSION_ERROR_MESSAGE);
  }
  if (!user.crews.includes(aidRequest.crew)) {
    return new Error(PERMISSION_ERROR_MESSAGE);
  }
  return aidRequest;
}

const NON_PERMISSION_ERROR_MESSAGE =
  'Unable to load aid request. The link you followed may be invalid or our server may be experiencing an issue.';
const PERMISSION_ERROR_MESSAGE =
  "You don't have permission to see this aid request";

import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import { createExpressApp } from 'src/server/root/web_request_listener/express_app';

createExpressApp();

type Handler = (aidRequest: AidRequest) => Promise<void>;

export default async function forEachAidRequest(
  handler: Handler,
): Promise<number> {
  const aidRequests = await AidRequestModel.find();
  for (let i = 0; i < aidRequests.length; i++) {
    const aidRequest = aidRequests[i];
    await handler(aidRequest);
  }
  return 0;
}

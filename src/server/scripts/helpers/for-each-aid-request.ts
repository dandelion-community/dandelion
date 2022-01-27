import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import express_app from 'src/server/root/express_app';

express_app; /* initialize */

export type HandlerReturnValue = 'NO_CHANGES' | 'CHANGES_SUCCESSFUL';

type Handler = (aidRequest: AidRequest) => Promise<HandlerReturnValue>;

export default async function forEachAidRequest(
  handler: Handler,
): Promise<number> {
  const aidRequests = await AidRequestModel.find();
  const counts: Record<HandlerReturnValue, number> = {
    CHANGES_SUCCESSFUL: 0,
    NO_CHANGES: 0,
  };
  for (let i = 0; i < aidRequests.length; i++) {
    const aidRequest = aidRequests[i];
    const handlerReturnValue = await handler(aidRequest);
    counts[handlerReturnValue]++;
  }
  console.log(JSON.stringify(counts));
  return 0;
}

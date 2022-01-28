import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import forEachAidRequest from 'src/server/scripts/helpers/for-each-aid-request';

async function processOneAidRequest(aidRequest: AidRequest): Promise<void> {
  if (
    aidRequest.whoIsWorkingOnIt == null ||
    aidRequest.whoIsWorkingOnIt.length === 0
  ) {
    await AidRequestModel.findByIdAndUpdate(aidRequest._id, {
      whoIsWorkingOnIt: [],
    });
  }
}

forEachAidRequest(processOneAidRequest).then((returnValue: number) => {
  process.exit(returnValue);
});

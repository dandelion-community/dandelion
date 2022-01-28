import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import getComputedFields from 'src/server/collections/aid_request/computed_fields/getComputedFields';
import forEachAidRequest from 'src/server/scripts/helpers/for-each-aid-request';

async function processOneAidRequest(aidRequest: AidRequest): Promise<void> {
  const computedFields = await getComputedFields(aidRequest);
  await AidRequestModel.findByIdAndUpdate(aidRequest._id, computedFields);
}

forEachAidRequest(processOneAidRequest).then((returnValue: number) => {
  process.exit(returnValue);
});

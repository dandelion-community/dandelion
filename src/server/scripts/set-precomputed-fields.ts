import deepEquals from 'fast-deep-equal';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import getComputedFields from 'src/server/collections/aid_request/computed_fields/getComputedFields';
import type { HandlerReturnValue } from 'src/server/scripts/helpers/for-each-aid-request';
import forEachAidRequest from 'src/server/scripts/helpers/for-each-aid-request';

async function processOneAidRequest(
  aidRequest: AidRequest,
): Promise<HandlerReturnValue> {
  const originalFields = { ...aidRequest };
  const computedFields = await getComputedFields(aidRequest);
  const newFields = {
    ...aidRequest,
    ...computedFields,
  };
  if (deepEquals(originalFields, newFields)) {
    return 'NO_CHANGES';
  } else {
    await AidRequestModel.findByIdAndUpdate(aidRequest._id, computedFields);
    return 'CHANGES_SUCCESSFUL';
  }
}

forEachAidRequest(processOneAidRequest).then((returnValue: number) => {
  process.exit(returnValue);
});

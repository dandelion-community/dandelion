import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import getComputedFields, {
  ComputedKey,
} from 'src/server/collections/aid_request/computed_fields/getComputedFields';
import forEachAidRequest from 'src/server/scripts/helpers/for-each-aid-request';

async function processOneAidRequest(aidRequest: AidRequest): Promise<void> {
  console.log('Processing', aidRequest._id.toString());
  const computedFields = await getComputedFields(aidRequest);
  for (const key in computedFields) {
    const newValue = computedFields[key as ComputedKey];
    const oldValue = aidRequest[key as ComputedKey];
    if (newValue?.valueOf() !== oldValue?.valueOf()) {
      console.log(`  ${key}: ${oldValue} -> ${newValue}`);
    }
  }
  await AidRequestModel.findByIdAndUpdate(aidRequest._id, computedFields);
}

forEachAidRequest(processOneAidRequest).then((returnValue: number) => {
  process.exit(returnValue);
});

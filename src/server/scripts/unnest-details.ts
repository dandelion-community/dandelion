import mongoose from 'mongoose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import forEachAidRequest from 'src/server/scripts/helpers/for-each-aid-request';

async function processOneAidRequest(aidRequest: AidRequest): Promise<void> {
  for (let i = 0; i < aidRequest.history.length; i++) {
    console.log('aidRequestID', aidRequest._id.toString());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This is an old property type
    if (aidRequest.history[i].details?.event) {
      await mongoose.connection.db.collection('aidrequests').updateOne(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { _id: aidRequest._id as any },
        {
          $set: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore This is an old property type
            [`history.${i}.event`]: aidRequest.history[i].details.event,
          },
        },
      );
    }
    await mongoose.connection.db.collection('aidrequests').updateOne(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { _id: aidRequest._id as any },
      {
        $unset: {
          [`history.${i}.details`]: '',
        },
      },
    );
  }
}

forEachAidRequest(processOneAidRequest).then((returnValue: number) => {
  process.exit(returnValue);
});

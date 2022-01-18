import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const whoRecordedIt: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Express.User | null> => {
    assertLoggedIn(req, 'whoRecordedIt');
    const aidRequest = await AidRequestModel.findById(aidRequestID);
    if (aidRequest == null) {
      return null;
    }
    return await getWhoRecordedRequest(aidRequest);
  },
  type: 'User',
};

export default whoRecordedIt;

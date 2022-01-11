import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';
import getWhoRecordedRequest from '../helpers/getWhoRecordedRequest';

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

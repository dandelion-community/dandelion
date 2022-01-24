import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
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
    const user = assertLoggedIn(req, 'AidRequest.whoRecordedIt');
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    return await getWhoRecordedRequest(aidRequest);
  },
  type: 'User',
};

export default whoRecordedIt;

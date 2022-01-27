import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import getWhoRecordedRequest from 'src/server/collections/aid_request/helpers/getWhoRecordedRequest';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const whoRecordedIt: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
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

import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import { maybeLoadMany } from '../../user/loader/loadUserForViewer';

const whoIsWorkingOnItUsers: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<Express.User>> => {
    const viewer = assertLoggedIn(req, 'AidRequest.whoIsWorkingOnItUsers');
    const aidRequest = await loadAidRequestForViewer(viewer, aidRequestID);
    const { whoIsWorkingOnIt: whoIsWorkingOnItUserIDs } = aidRequest;
    return await maybeLoadMany(viewer, whoIsWorkingOnItUserIDs);
  },
  type: '[User]',
};

export default whoIsWorkingOnItUsers;

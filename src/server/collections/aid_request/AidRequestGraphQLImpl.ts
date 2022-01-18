import { AidRequestGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import logAllAidRequestsMiddleware from 'src/server/collections/aid_request/helpers/logAllAidRequestsMiddleware';
import createAidRequest from 'src/server/collections/aid_request/mutations/createAidRequest';
import editAidRequest from 'src/server/collections/aid_request/mutations/editAidRequest';
import actionsAvailable from 'src/server/collections/aid_request/object_fields/actionsAvailable';
import history from 'src/server/collections/aid_request/object_fields/history';
import latestEvent from 'src/server/collections/aid_request/object_fields/latestEvent';
import whoIsWorkingOnItUsers from 'src/server/collections/aid_request/object_fields/whoIsWorkingOnItUsers';
import whoRecordedIt from 'src/server/collections/aid_request/object_fields/whoRecordedIt';
import { createAssertLoggedInMiddleware } from 'src/server/graphql/assertLoggedIn';

AidRequestGraphQLType.addFields({
  actionsAvailable,
  history,
  latestEvent,
  whoIsWorkingOnItUsers,
  whoRecordedIt,
});

const AidRequest = {
  MutationFields: {
    createAidRequest,
    editAidRequest,
  },
  QueryFields: {
    allAidRequests: AidRequestGraphQLType.getResolver('connection', [
      createAssertLoggedInMiddleware('allAidRequests'),
      logAllAidRequestsMiddleware(),
    ]),
  },
};

export default AidRequest;

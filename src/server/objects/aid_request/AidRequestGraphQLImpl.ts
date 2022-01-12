import { createAssertLoggedInMiddleware } from '../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from './AidRequestGraphQLTypes';
import createAidRequest from './mutations/createAidRequest';
import editAidRequest from './mutations/editAidRequest';
import actionsAvailable from './object_fields/actionsAvailable';
import history from './object_fields/history';
import latestEvent from './object_fields/latestEvent';
import whoIsWorkingOnItUsers from './object_fields/whoIsWorkingOnItUsers';
import whoRecordedIt from './object_fields/whoRecordedIt';

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
    ]),
  },
};

export default AidRequest;

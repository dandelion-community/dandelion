import { createAssertLoggedInMiddleware } from '../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from './AidRequestGraphQLTypes';
import createAidRequest from './mutations/createAidRequest';
import updateIsAidRequestComplete from './mutations/updateIsAidRequestComplete';
import updateWhetherIAmWorkingOnThisAidRequest from './mutations/updateWhetherIAmWorkingOnThisAidRequest';
import history from './object_fields/history';
import whoIsWorkingOnItUsers from './object_fields/whoIsWorkingOnItUsers';

AidRequestGraphQLType.addFields({
  history,
  whoIsWorkingOnItUsers,
});

const AidRequest = {
  MutationFields: {
    createAidRequest,
    updateIsAidRequestComplete,
    updateWhetherIAmWorkingOnThisAidRequest,
  },
  QueryFields: {
    allAidRequests: AidRequestGraphQLType.getResolver('connection', [
      createAssertLoggedInMiddleware('allAidRequests'),
    ]),
  },
};

export default AidRequest;

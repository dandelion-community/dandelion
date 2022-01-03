import { AidRequestGraphQLType } from './AidRequestGraphQLTypes';
import createAidRequest from './mutations/createAidRequest';
import updateIsAidRequestComplete from './mutations/updateIsAidRequestComplete';
import {
  addUserWhoIsWorkingOnAnAidRequest,
  removeUserWhoIsWorkingOnAnAidRequest,
} from './mutations/updateUsersWhoAreWorkingOnAnAidRequest';
import whoIsWorkingOnItUsers from './object_fields/whoIsWorkingOnItUsers';

AidRequestGraphQLType.addFields({
  whoIsWorkingOnItUsers,
});

const AidRequest = {
  MutationFields: {
    addUserWhoIsWorkingOnAnAidRequest,
    createAidRequest,
    removeUserWhoIsWorkingOnAnAidRequest,
    updateIsAidRequestComplete,
  },
  QueryFields: {
    allAidRequests: AidRequestGraphQLType.getResolver('connection'),
  },
};

export default AidRequest;

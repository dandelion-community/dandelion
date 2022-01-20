import { AidRequestGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import createAidRequest from 'src/server/collections/aid_request/mutations/createAidRequest';
import editAidRequest from 'src/server/collections/aid_request/mutations/editAidRequest';
import actionsAvailable from 'src/server/collections/aid_request/object_fields/actionsAvailable';
import history from 'src/server/collections/aid_request/object_fields/history';
import latestEvent from 'src/server/collections/aid_request/object_fields/latestEvent';
import whoIsWorkingOnItUsers from 'src/server/collections/aid_request/object_fields/whoIsWorkingOnItUsers';
import whoRecordedIt from 'src/server/collections/aid_request/object_fields/whoRecordedIt';
import allAidRequests from 'src/server/collections/aid_request/query_fields/allAidRequests';

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
    allAidRequests,
  },
};

export default AidRequest;

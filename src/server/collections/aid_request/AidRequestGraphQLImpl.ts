import { AidRequestGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import createAidRequest from 'src/server/collections/aid_request/mutations/createAidRequest';
import editAidRequest from 'src/server/collections/aid_request/mutations/editAidRequest';
import actionsAvailable from 'src/server/collections/aid_request/object_fields/actionsAvailable';
import completed from 'src/server/collections/aid_request/object_fields/completed';
import createdAt from 'src/server/collections/aid_request/object_fields/createdAt';
import history from 'src/server/collections/aid_request/object_fields/history';
import latestEvent from 'src/server/collections/aid_request/object_fields/latestEvent';
import whatIsNeeded from 'src/server/collections/aid_request/object_fields/whatIsNeeded';
import whoIsItFor from 'src/server/collections/aid_request/object_fields/whoIsItFor';
import whoIsWorkingOnItUsers from 'src/server/collections/aid_request/object_fields/whoIsWorkingOnItUsers';
import whoRecordedIt from 'src/server/collections/aid_request/object_fields/whoRecordedIt';
import _id from 'src/server/collections/aid_request/object_fields/_id';
import allAidRequests from 'src/server/collections/aid_request/query_fields/allAidRequests';

AidRequestGraphQLType.addFields({
  _id,
  actionsAvailable,
  completed,
  createdAt,
  history,
  latestEvent,
  whatIsNeeded,
  whoIsItFor,
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

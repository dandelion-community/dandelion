import { AidRequestGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import createAidRequestPermissionMiddleware from 'src/server/collections/aid_request/helpers/createAidRequestPermissionMiddleware';
import logAllAidRequestsMiddleware from 'src/server/collections/aid_request/helpers/logAllAidRequestsMiddleware';
import { createAssertLoggedInMiddleware } from 'src/server/graphql/assertLoggedIn';

const allAidRequests = AidRequestGraphQLType.getResolver<
  Record<string, unknown> /* TArgs */
>('connection', [
  createAssertLoggedInMiddleware('allAidRequests'),
  logAllAidRequestsMiddleware(),
  createAidRequestPermissionMiddleware(),
]).addFilterArg({
  name: 'search',
  query: (query, value) => {
    query.$text = {
      $language: 'en',
      $search: value,
    };
  },
  type: 'String',
});

export default allAidRequests;

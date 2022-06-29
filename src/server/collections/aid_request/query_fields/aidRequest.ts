import analytics from 'src/server/analytics';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import { AidRequest, AidRequestGraphQLType } from '../AidRequestGraphQLTypes';

type Args = {
  aidRequestID: string;
};

const aidRequests = AidRequestGraphQLType.schemaComposer.createResolver<
  Express.User,
  Args
>({
  args: {
    aidRequestID: 'String!',
  },
  kind: 'query',
  name: 'aidRequest',
  resolve: async ({ args, context: request }): Promise<AidRequest> => {
    const user = assertLoggedIn(request, 'aidRequest');
    const { aidRequestID } = args;
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);

    analytics.track({
      event: 'Loaded Aid Request Details',
      properties: {
        aidRequestID,
      },
      user,
    });

    return aidRequest;
  },
  type: 'AidRequest!',
});

export default aidRequests;

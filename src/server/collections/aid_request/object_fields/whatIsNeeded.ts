import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

type ReturnType = string;
const GraphQLType = 'String!';

const whatIsNeeded: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<ReturnType> => {
    const user = assertLoggedIn(req, 'AidRequest.whatIsNeeded', {
      assertUIIsHandlingErrors: true,
    });
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    return aidRequest.whatIsNeeded;
  },
  type: GraphQLType,
};

export default whatIsNeeded;

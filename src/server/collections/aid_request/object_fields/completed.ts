import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

type ReturnType = boolean;
const GraphQLType = 'Boolean!';

const completed: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<ReturnType> => {
    const user = assertLoggedIn(req, 'AidRequest.completed');
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    return aidRequest.completed;
  },
  type: GraphQLType,
};

export default completed;

import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

async function updateIsAidRequestCompleteResolver(
  _: unknown,
  { id, newValue }: { id: string; newValue: boolean },
  req: Express.Request,
): Promise<AidRequestType | null> {
  assertLoggedIn(req, 'Update is aid request complete');
  return await AidRequestModel.findOneAndUpdate(
    { _id: id },
    { completed: newValue },
    { new: true },
  );
}

const updateIsAidRequestComplete = {
  args: {
    id: 'String!',
    newValue: 'Boolean!',
  },
  resolve: updateIsAidRequestCompleteResolver,
  type: AidRequestGraphQLType,
};

export default updateIsAidRequestComplete;

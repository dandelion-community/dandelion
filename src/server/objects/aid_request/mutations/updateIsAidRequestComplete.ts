import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

async function updateIsAidRequestCompleteResolver(
  _: unknown,
  { id, newValue }: { id: string; newValue: boolean },
  req: Express.Request,
): Promise<AidRequestType | null> {
  const user = assertLoggedIn(req, 'Update is aid request complete');
  return await AidRequestModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        history: {
          action: newValue === true ? 'Add' : 'Remove',
          actor: user._id,
          details: { event: 'Completed' },
          timestamp: new Date(),
        },
      },
      completed: newValue,
    },
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

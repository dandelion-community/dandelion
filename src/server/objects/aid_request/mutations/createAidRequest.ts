import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestGraphQLType } from '../AidRequestGraphQLTypes';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

async function createAidRequestResolver(
  _: unknown,
  {
    whatIsNeeded,
    whoIsItFor,
  }: {
    whatIsNeeded: string;
    whoIsItFor: string;
  },
  req: Express.Request,
): Promise<AidRequestType> {
  const user = assertLoggedIn(req, 'Create aid request');
  const whoRecordedItUsername = user.username;
  const whoRecordedIt = user._id;
  const aidRequest = new AidRequestModel({
    completed: false,
    createdAt: Date.now(),
    whatIsNeeded,
    whoIsItFor,
    whoIsWorkingOnIt: [],
    whoRecordedIt,
    whoRecordedItUsername,
  });
  return await aidRequest.save();
}

const createAidRequest = {
  args: {
    whatIsNeeded: 'String!',
    whoIsItFor: 'String!',
  },
  resolve: createAidRequestResolver,
  type: AidRequestGraphQLType,
};

export default createAidRequest;

import analytics from '../../../analytics/index';
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
  const timestamp = new Date();
  const creationEvent = {
    action: 'Add',
    actor: user._id,
    details: { event: 'Created' },
    timestamp,
  };
  const aidRequest = new AidRequestModel({
    completed: false,
    createdAt: Date.now(),
    history: [creationEvent],
    whatIsNeeded,
    whoIsItFor,
    whoIsWorkingOnIt: [],
    whoRecordedIt,
    whoRecordedItUsername,
  });
  const savedRequest = await aidRequest.save();
  analytics.track({
    event: 'Created Aid Request',
    properties: {
      aidRequestID: aidRequest._id,
      whatIsNeeded,
      whoIsItFor,
    },
    user,
  });
  return savedRequest;
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

import analytics from 'src/server/analytics';
import { AidRequestGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type {
  AidRequestHistoryEvent,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import getComputedFields from '../computed_fields/getComputedFields';

async function createAidRequestResolver(
  _: unknown,
  {
    crew,
    whatIsNeeded,
    whoIsItFor,
  }: {
    crew: string;
    whatIsNeeded: string;
    whoIsItFor: string;
  },
  req: Express.Request,
): Promise<AidRequestType> {
  const user = assertLoggedIn(req, 'Create aid request');
  if (!user.crews.includes(crew)) {
    throw new Error(
      "You don't have permission to create a request for this crew",
    );
  }
  const whoRecordedIt = user._id;
  const timestamp = new Date();
  const creationEvent: AidRequestHistoryEvent = {
    action: 'Add',
    actor: user._id,
    details: { event: 'Created' },
    timestamp,
  };
  const fields = {
    completed: false,
    createdAt: new Date(),
    crew,
    history: [creationEvent],
    whatIsNeeded,
    whoIsItFor,
    whoIsWorkingOnIt: [],
    whoRecordedIt,
  };
  const computedFields = await getComputedFields(fields);
  const aidRequest = new AidRequestModel({
    ...fields,
    ...computedFields,
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
    crew: 'String!',
    whatIsNeeded: 'String!',
    whoIsItFor: 'String!',
  },
  resolve: createAidRequestResolver,
  type: AidRequestGraphQLType,
};

export default createAidRequest;

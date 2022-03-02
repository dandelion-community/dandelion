import analytics from 'src/server/analytics';
import type { CreateAidRequestsPayloadType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { CreateAidRequestsPayloadGraphQLType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import { AidRequestHistoryEvent } from '../AidRequestModelTypes';
import getComputedFields from '../computed_fields/getComputedFields';

async function createAidRequestsResolver(
  _: unknown,
  {
    crew,
    whatIsNeeded: whatAllIsNeeded,
    whoIsItFor,
  }: {
    crew: string;
    whatIsNeeded: string[];
    whoIsItFor: string;
  },
  req: Express.Request,
): Promise<CreateAidRequestsPayloadType> {
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
    event: 'Created',
    timestamp,
  };
  const aidRequests = whatAllIsNeeded.map(async (whatIsNeeded: string) => {
    const manualFields = {
      completed: false,
      createdAt: new Date(),
      crew,
      history: [creationEvent],
      whatIsNeeded,
      whoIsItFor,
      whoIsWorkingOnIt: [],
      whoRecordedIt,
    };
    const computedFields = await getComputedFields(manualFields);
    const fields = { ...manualFields, ...computedFields };
    return new AidRequestModel(fields);
  });
  const savedRequests = await Promise.all(
    aidRequests.map(async (aidRequestPromise) => {
      const aidRequest = await aidRequestPromise;
      return await aidRequest.save();
    }),
  );
  savedRequests.forEach((aidRequest) => {
    analytics.track({
      event: 'Created Aid Request',
      properties: {
        aidRequestID: aidRequest._id,
        crew,
        whatIsNeeded: aidRequest.whatIsNeeded,
        whoIsItFor,
      },
      user,
    });
  });
  return {
    postpublishSummary: `Recorded ${
      whatAllIsNeeded.length === 1
        ? whatAllIsNeeded[0]
        : whatAllIsNeeded.length.toString() + ' requests'
    } for ${whoIsItFor}${user.crews.length > 1 ? ' (' + crew + ')' : ''}`,
    requests: savedRequests,
  };
}

const createAidRequests = {
  args: {
    crew: 'String!',
    whatIsNeeded: '[String!]!',
    whoIsItFor: 'String!',
  },
  resolve: createAidRequestsResolver,
  type: CreateAidRequestsPayloadGraphQLType,
};

export default createAidRequests;

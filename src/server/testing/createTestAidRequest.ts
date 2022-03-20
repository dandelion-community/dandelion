import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import nextTestID from './nextTestID';

jest.mock('src/server/collections/aid_request/AidRequestModel', () => ({
  AidRequestModel: {
    findById,
  },
}));

const testAidRequests: Map<string, AidRequestType> = new Map();

export default function createTestAidRequest(
  aidRequest_: Partial<AidRequestType> & Pick<AidRequestType, 'whoRecordedIt'>,
): AidRequestType {
  const aidRequest = fillInDefaults(aidRequest_);
  testAidRequests.set(aidRequest._id.toString(), aidRequest);
  return aidRequest;
}

function findById(id: string): AidRequestType | undefined {
  return testAidRequests.get(id.toString());
}

function fillInDefaults(
  aidRequest: Partial<AidRequestType> & Pick<AidRequestType, 'whoRecordedIt'>,
): AidRequestType {
  return {
    _id: nextTestID().toString(),
    completed: false,
    createdAt: new Date(),
    crew: 'Test Crew 1',
    history: [
      {
        action: 'Add',
        actor: aidRequest.whoRecordedIt,
        event: 'Created',
        timestamp: new Date(),
      },
    ],
    lastUpdated: new Date(),
    whatIsNeeded: 'What is Needed',
    whatIsNeededSearch: 'What is Needed',
    whoIsItFor: 'Who is it For',
    whoIsItForSearch: 'Who is it For',
    whoIsWorkingOnIt: [],
    whoIsWorkingOnItSearch: '',
    whoRecordedItSearch: '',
    whoRecordedItUsername: '',
    ...aidRequest,
  };
}

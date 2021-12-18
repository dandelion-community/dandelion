import { model, Schema } from 'mongoose';

export const GQL_AID_REQUEST_TYPES = `
  type AidRequest {
    _id: String
    completed: Boolean
    whatIsNeeded: String
    whoIsItFor: String
    whoRecordedItUsername: String
  }
`;

export const GQL_CREATE_AID_REQUEST_MUTATION = `
  createAidRequest(
    whatIsNeeded: String!
    whoIsItFor: String!
  ): AidRequest
`;

type AidRequestType = {
  completed: boolean;
  createdAt: Date;
  whatIsNeeded: string;
  whoIsItFor: string;
  whoRecordedItUsername: string;
  _id: string;
};

const AidRequestSchema = new Schema<AidRequestType>({
  completed: Boolean,
  createdAt: Date,
  whatIsNeeded: String,
  whoIsItFor: String,
  whoRecordedItUsername: String,
});

const AidRequest = model<AidRequestType>('AidRequest', AidRequestSchema);

type CreateAidRequestMutationArgs = {
  whatIsNeeded: string;
  whoIsItFor: string;
};

export async function createAidRequest(
  { whatIsNeeded, whoIsItFor }: CreateAidRequestMutationArgs,
  req: Express.Request,
): Promise<AidRequestType> {
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in to create a request');
  }
  const whoRecordedItUsername = (user as any).username;
  const aidRequest = new AidRequest({
    completed: false,
    createdAt: Date.now(),
    whatIsNeeded,
    whoIsItFor,
    whoRecordedItUsername,
  });
  return await aidRequest.save();
}

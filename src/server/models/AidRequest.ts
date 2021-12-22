import { composeWithMongoose } from 'graphql-compose-mongoose';
import { model, Schema } from 'mongoose';

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

const AidRequestModel = model<AidRequestType>('AidRequest', AidRequestSchema);

const AidRequestComposerType = composeWithMongoose(AidRequestModel);

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
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in to create a request');
  }
  const whoRecordedItUsername = user.username;
  const aidRequest = new AidRequestModel({
    completed: false,
    createdAt: Date.now(),
    whatIsNeeded,
    whoIsItFor,
    whoRecordedItUsername,
  });
  return await aidRequest.save();
}

async function updateIsAidRequestComplete(
  _: unknown,
  { id, newValue }: { id: string; newValue: boolean },
  req: Express.Request,
): Promise<AidRequestType | null> {
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in to create a request');
  }
  return await AidRequestModel.findOneAndUpdate(
    { _id: id },
    { completed: newValue },
    { new: true },
  );
}

const AidRequest = {
  MutationFields: {
    createAidRequest: {
      args: {
        whatIsNeeded: 'String!',
        whoIsItFor: 'String!',
      },
      resolve: createAidRequestResolver,
      type: AidRequestComposerType,
    },
    updateIsAidRequestComplete: {
      args: {
        id: 'String!',
        newValue: 'Boolean!',
      },
      resolve: updateIsAidRequestComplete,
      type: AidRequestComposerType,
    },
  },
  QueryFields: {
    allAidRequests: AidRequestComposerType.getResolver('connection'),
  },
};

export default AidRequest;

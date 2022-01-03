import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Document } from 'mongoose';
import { AidRequestModel } from './AidRequestModel';
import type { AidRequestType } from './AidRequestModelTypes';

export const AidRequestGraphQLType =
  composeWithMongoose<Document<string, unknown, AidRequestType>>(
    AidRequestModel,
  );

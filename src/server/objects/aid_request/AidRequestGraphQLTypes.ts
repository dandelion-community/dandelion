import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Document } from 'mongoose';
import { AidRequestModel } from './AidRequestModel';
import type { AidRequestType } from './AidRequestModelTypes';

export const AidRequestGraphQLType =
  composeWithMongoose<Document<string, unknown, AidRequestType>>(
    AidRequestModel,
  );

export const AidRequestHistoryEventPayloadGraphQLType =
  schemaComposer.createObjectTC({
    fields: {
      event: 'String!',
    },
    name: 'AidRequestHistoryEventPayload',
  });

export const AidRequestHistoryEventGraphQLType = schemaComposer.createObjectTC({
  fields: {
    action: 'String!',
    actor: 'User',
    details: 'AidRequestHistoryEventPayload',
    timestamp: 'Date!',
  },
  name: 'AidRequestHistoryEvent',
});

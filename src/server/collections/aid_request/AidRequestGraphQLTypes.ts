import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Document } from 'mongoose';
import { AidRequestModel } from './AidRequestModel';
import type { AidRequestType } from './AidRequestModelTypes';

export const AidRequestGraphQLType =
  composeWithMongoose<Document<string, unknown, AidRequestType>>(
    AidRequestModel,
  );

export const AidRequestUpdateStatusTypeGraphQLType =
  schemaComposer.createEnumTC(
    `enum AidRequestUpdateStatusType { 
      Completed 
      WorkingOn 
      Created
      Deleted
    }`,
  );

export const AidRequestUpdateActionTypeGraphQLType =
  schemaComposer.createEnumTC(
    `enum AidRequestUpdateActionType { 
      Add
      Remove
    }`,
  );

export const AidRequestHistoryEventPayloadGraphQLType =
  schemaComposer.createObjectTC({
    fields: {
      event: 'AidRequestUpdateStatusType!',
    },
    name: 'AidRequestHistoryEventPayload',
  });

export const AidRequestHistoryEventPayloadInputType =
  schemaComposer.createInputTC({
    fields: {
      event: 'AidRequestUpdateStatusType!',
    },
    name: 'AidRequestHistoryEventPayloadInput',
  });

export const AidRequestHistoryEventGraphQLType = schemaComposer.createObjectTC({
  fields: {
    action: 'AidRequestUpdateActionType!',
    actor: 'User',
    aidRequest: 'AidRequest',
    details: 'AidRequestHistoryEventPayload!',
    postpublishSummary: 'String',
    timestamp: 'Date!',
    undoID: 'String',
  },
  name: 'AidRequestHistoryEvent',
});

export const AidRequestActionInputGraphQLType = schemaComposer.createObjectTC({
  fields: {
    action: 'AidRequestUpdateActionType!',
    details: 'AidRequestHistoryEventPayload!',
  },
  name: 'AidRequestActionInput',
});

export const AidRequestActionInputInputType = schemaComposer.createInputTC({
  fields: {
    action: 'AidRequestUpdateActionType!',
    details: 'AidRequestHistoryEventPayloadInput!',
  },
  name: 'AidRequestActionInputInput',
});

export const AidRequestActionOptionGraphQLType = schemaComposer.createObjectTC({
  fields: {
    icon: 'String',
    input: 'AidRequestActionInput!',
    message: 'String!',
  },
  name: 'AidRequestActionOption',
});

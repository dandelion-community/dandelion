import { schemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { Document } from 'mongoose';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { AidRequestType } from 'src/server/collections/aid_request/AidRequestModelTypes';

export const AidRequestGraphQLType = composeWithMongoose<
  Document<string, unknown, AidRequestType>
>(AidRequestModel, {
  fields: {
    only: [
      // Whenever you add a field here make sure to
      // implement a resolver in the object_fields directory
      // and register it in AidRequestGraphQLImpl
      // that checks the user's permission to load the aidRequest
      '_id',
      'actionsAvailable',
      'completed',
      'createdAt',
      'crew',
      'history',
      'latestEvent',
      'whatIsNeeded',
      'whoIsItFor',
      'whoIsWorkingOnIt',
      'whoIsWorkingOnItUsers',
      'whoRecordedIt',
    ],
  },
});

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

export type CreateAidRequestsPayloadType = {
  postpublishSummary: string;
  requests: Document<string, unknown, AidRequestType>[];
};

export const CreateAidRequestsPayloadGraphQLType =
  schemaComposer.createObjectTC({
    fields: {
      postpublishSummary: 'String!',
      requests: [AidRequestGraphQLType],
    },
    name: 'CreateAidRequestsPayload',
  });

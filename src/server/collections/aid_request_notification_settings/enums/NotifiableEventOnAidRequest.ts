import { schemaComposer } from 'graphql-compose';

export type NotifiableEventOnAidRequest = 'NewComment';

export const ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS: NotifiableEventOnAidRequest[] =
  ['NewComment'];

export const NOTIFIABLE_EVENTS_ON_AID_REQUESTS_MONGOOSE_ENUM = {
  enum: ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS,
  type: String,
};

export const NotifiableEventOnAidRequestGraphQLType =
  schemaComposer.createEnumTC(
    `enum NotifiableEventOnAidRequest { 
      NewComment
    }`,
  );

export const NOTIFIAbLE_EVENT_DESCRIPTIONS: Map<
  NotifiableEventOnAidRequest,
  string
> = new Map([
  ['NewComment', "Someone commented on a request you're subscribed to"],
]);

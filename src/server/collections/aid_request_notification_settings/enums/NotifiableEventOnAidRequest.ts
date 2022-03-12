import { schemaComposer } from 'graphql-compose';

export type NotifiableEventOnAidRequest =
  | 'NewComment'
  | 'Any'
  | 'YouWereMentionedInAComment';

export const ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS: NotifiableEventOnAidRequest[] =
  ['NewComment', 'Any', 'YouWereMentionedInAComment'];

export const NOTIFIABLE_EVENTS_ON_AID_REQUESTS_MONGOOSE_ENUM = {
  enum: ALL_NOTIFIABLE_EVENTS_ON_AID_REQUESTS,
  type: String,
};

export const NotifiableEventOnAidRequestGraphQLType =
  schemaComposer.createEnumTC(
    `enum NotifiableEventOnAidRequest { 
      NewComment
      Any
      YouWereMentionedInAComment
    }`,
  );

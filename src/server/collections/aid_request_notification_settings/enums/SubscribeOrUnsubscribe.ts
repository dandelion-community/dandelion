import { schemaComposer } from 'graphql-compose';

export type SubscribeOrUnsubscribe = 'Subscribe' | 'Unsubscribe';

export const ALL_SUBSCRIBE_OR_UNSUBSCRIBE_VALUES: SubscribeOrUnsubscribe[] = [
  'Subscribe',
  'Unsubscribe',
];

export const SUBSCRIBE_OR_UNSUBSCRIBE_MONGOOSE_ENUM = {
  enum: ALL_SUBSCRIBE_OR_UNSUBSCRIBE_VALUES,
  type: String,
};

export const SubscribeOrUnsubscribeGraphQLType = schemaComposer.createEnumTC(
  `enum SubscribeOrUnsubscribe { 
      Subscribe
      Unsubscribe
    }`,
);

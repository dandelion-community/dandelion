import { schemaComposer } from 'graphql-compose';

export type NotificationMethod = 'Email';

export const ALL_NOTIFICATION_METHODS: NotificationMethod[] = ['Email'];

export const NOTIFICATION_METHOD_MONGOOSE_ENUM = {
  enum: ALL_NOTIFICATION_METHODS,
  type: String,
};

export const NotificationMethodGraphQLType = schemaComposer.createEnumTC(
  `enum NotificationMethod { 
      Email
    }`,
);

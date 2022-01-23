import { schemaComposer } from 'graphql-compose';

export const UserGraphQLType = schemaComposer.createObjectTC<Express.User>({
  fields: {
    _id: 'String!',
    aidRequestsIAmWorkingOn: '[AidRequest]',
    crews: '[String!]!',
    displayName: 'String!',
    username: 'String!',
  },
  name: 'User',
});

export const CurrentUserGraphQLType = schemaComposer.createObjectTC({
  fields: {
    user: 'User',
  },
  name: 'CurrentUser',
});

export type CurrentUserPayload = {
  user: Express.User | undefined;
};

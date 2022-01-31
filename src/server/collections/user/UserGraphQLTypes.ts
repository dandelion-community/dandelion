import { schemaComposer } from 'graphql-compose';

export type Person = {
  displayName: string;
};

schemaComposer.createInterfaceTC<Person>({
  fields: {
    displayName: 'String!',
  },
  name: 'Person',
  resolveType: (obj: Person): string => {
    if ('_id' in obj) {
      return 'User';
    } else {
      return 'UnregisteredPerson';
    }
  },
});

export const UnregisteredPersonGraphQLType = schemaComposer.createObjectTC<{
  displayName: string;
}>({
  fields: {
    displayName: 'String!',
  },
  interfaces: ['Person'],
  name: 'UnregisteredPerson',
});

export const UserGraphQLType = schemaComposer.createObjectTC<Express.User>({
  fields: {
    _id: 'String!',
    aidRequestsIAmWorkingOn: '[AidRequest]',
    crews: '[String!]!',
    displayName: 'String!',
    username: 'String!',
  },
  interfaces: ['Person'],
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

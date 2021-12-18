import type { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import {
  createAidRequest,
  GQL_AID_REQUEST_TYPES,
  GQL_CREATE_AID_REQUEST_MUTATION,
} from '../aid_requests';
import {
  CURRENT_USER_PAYLOAD_GQL,
  login,
  logout,
  me,
  register,
  USER_GQL,
} from '../authentication/graphql';

const schema = buildSchema(`
  type Query {
    me: User
  }

  type Mutation {
    login(
      username: String!
      password: String!
    ): CurrentUserPayload

    logout: CurrentUserPayload

    register(
      username: String!
      password: String!
    ): CurrentUserPayload

    ${GQL_CREATE_AID_REQUEST_MUTATION}
  }

  ${USER_GQL}
  ${CURRENT_USER_PAYLOAD_GQL}
  ${GQL_AID_REQUEST_TYPES}
`);

const rootValue = {
  createAidRequest,
  login,
  logout,
  me,
  register,
};

export function initGraphQL(app: Express): void {
  app.use(
    '/graphql',
    graphqlHTTP({
      graphiql: true,
      rootValue,
      schema: schema,
    }),
  );
}

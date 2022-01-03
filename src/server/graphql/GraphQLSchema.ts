import type { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SchemaComposer } from 'graphql-compose';
import AidRequest from '../objects/aid_request/AidRequestGraphQLImpl';
import User from '../objects/user/UserGraphQLImpl';

const composer = new SchemaComposer();

composer.Query.addFields({
  ...AidRequest.QueryFields,
  ...User.QueryFields,
});

composer.Mutation.addFields({
  ...AidRequest.MutationFields,
  ...User.MutationFields,
});

const schema = composer.buildSchema();

export function initGraphQL(app: Express): void {
  app.use(
    '/graphql',
    graphqlHTTP({
      graphiql: true,
      schema,
    }),
  );
}

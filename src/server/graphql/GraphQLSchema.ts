import type { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SchemaComposer } from 'graphql-compose';
import AidRequest from 'src/server/collections/aid_request/AidRequestGraphQLImpl';
import attributions from 'src/server/collections/user/root_fields/attribution/attributions';
import User from 'src/server/collections/user/UserGraphQLImpl';
import reportError from 'src/server/graphql/reportError';

const composer = new SchemaComposer();

composer.Query.addFields({
  ...AidRequest.QueryFields,
  ...User.QueryFields,
  attributions,
});

composer.Mutation.addFields({
  ...AidRequest.MutationFields,
  ...User.MutationFields,
  reportError,
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

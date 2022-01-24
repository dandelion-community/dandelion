import createClient from 'src/client/graphql/createClient';
import GraphQLClientURI from 'src/client/graphql/GraphQLClientURI';

const client = createClient(GraphQLClientURI);

export default client;

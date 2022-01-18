import createClient from 'graphql/createClient';
import GraphQLClientURI from 'graphql/GraphQLClientURI';

const client = createClient(GraphQLClientURI);

export default client;

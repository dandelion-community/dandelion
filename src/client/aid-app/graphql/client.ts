import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:3000/graphql',
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: httpLink,
});

export default client;

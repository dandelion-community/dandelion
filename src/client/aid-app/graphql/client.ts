import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const link = createHttpLink({
  uri: 'http://127.0.0.1:3000/graphql',
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  credentials: 'include',
  link,
});

export default client;

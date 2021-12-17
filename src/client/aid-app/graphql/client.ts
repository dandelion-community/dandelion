import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

const link = createHttpLink({
  uri: '/graphql',
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  credentials: 'include',
  link,
});

export default client;

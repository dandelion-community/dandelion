const uri = /*process.env.GRAPHQL_URI*/ 'http://localhost:3000/graphql';

if (!uri) {
  throw new Error('GRAPHQL_URI is not set in process.env');
}

export default uri as string;

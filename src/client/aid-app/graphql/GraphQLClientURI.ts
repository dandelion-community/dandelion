const uri = process.env.GRAPHQL_URI;

if (!uri) {
  throw new Error('GRAPHQL_URI is not set in process.env');
}

export default uri as string;

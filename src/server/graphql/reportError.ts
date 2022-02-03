import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

async function reportErrorResolver(
  _: unknown,
  { data }: { data: string },
  _req: Express.Request,
): Promise<string> {
  const slug = nanoid();
  mongoose.connection.db.collection('errors').insertOne({
    data,
    slug,
  });
  return slug;
}

const reportError = {
  args: {
    data: 'String',
  },
  resolve: reportErrorResolver,
  type: 'String',
};

export default reportError;

import dotenv from 'dotenv';
import { UserModel } from 'src/server/collections/user/UserModel';
import email from 'src/server/email';
import getPasswordResetToken from '../helpers/getPasswordResetToken';

dotenv.config();

async function forgotPasswordResolver(
  _: unknown,
  { username }: { username: string },
  req: Express.Request,
): Promise<string | undefined> {
  const user = await UserModel.findOne({ username });
  if (user == null) {
    console.log('no user found');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Unknown property
  const host = req.headers.host;

  const token = getPasswordResetToken(username);
  const protocol = (host as string).endsWith(':3000') ? 'http' : 'https';

  email.send({
    body: `If you requested a password reset, follow this link to complete it: ${protocol}://${host}/reset_password/${username}/${token}`,
    subject: 'Dandelion Password Reset',
    username,
  });

  return 'Email sent';
}

const forgotPassword = {
  args: {
    username: 'String!',
  },
  resolve: forgotPasswordResolver,
  type: 'String',
};

export default forgotPassword;

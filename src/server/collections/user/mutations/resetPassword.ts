import { UserModel } from 'src/server/collections/user/UserModel';
import { decrypt } from 'src/server/utils/crypto/encryption';

async function resetPasswordResolver(
  _: unknown,
  { password, token }: { password: string; token: string },
  _req: Express.Request,
): Promise<string> {
  const [expireTime_, userID] = decrypt(token).split('.');
  const expireTime = new Date(parseInt(expireTime_, 10) * 1000);
  const user = await UserModel.findById(userID);
  if (user == null) {
    throw new Error('User does not exist');
  }
  if (expireTime < new Date()) {
    throw new Error('This link is expired');
  }
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  /* @ts-ignore */
  await user.setPassword(password);
  await user.save();

  return 'Your password was updated successfully.';
}

const resetPassword = {
  args: {
    password: 'String!',
    token: 'String!',
  },
  resolve: resetPasswordResolver,
  type: 'String!',
};

export default resetPassword;

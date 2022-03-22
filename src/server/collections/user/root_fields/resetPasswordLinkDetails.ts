import { schemaComposer } from 'graphql-compose';
import { decrypt } from 'src/server/utils/crypto/encryption';
import { UserModel } from '../UserModel';

const ResetPasswordLinkDetailsGraphQLType =
  schemaComposer.createObjectTC<ResetPasswordLinkDetails>({
    fields: {
      expiration_time: 'Date!',
      is_valid: 'Boolean!',
      username: 'String!',
    },
    name: 'ResetPasswordLinkDetails',
  });

type ResetPasswordLinkDetails = {
  expiration_time: Date;
  is_valid: boolean;
  username: string;
};

type Args = {
  token: string;
};

async function resetPasswordLinkDetailsResolver(
  _: unknown,
  { token }: Args,
  _req: Express.Request,
): Promise<ResetPasswordLinkDetails> {
  try {
    const [expireTime, userID] = decrypt(token).split('.');
    const user = await UserModel.findById(userID);
    if (user == null) {
      return {
        expiration_time: new Date(),
        is_valid: false,
        username: '',
      };
    }
    return {
      expiration_time: new Date(parseInt(expireTime, 10) * 1000),
      is_valid: true,
      username: user.username,
    };
  } catch (e) {
    return {
      expiration_time: new Date(),
      is_valid: false,
      username: '',
    };
  }
}

const resetPasswordLinkDetails = {
  args: {
    token: 'String!',
  },
  resolve: resetPasswordLinkDetailsResolver,
  type: ResetPasswordLinkDetailsGraphQLType,
};

export default resetPasswordLinkDetails;

import changeName from 'src/server/collections/user/mutations/changeName';
import login from 'src/server/collections/user/mutations/login';
import logout from 'src/server/collections/user/mutations/logout';
import register from 'src/server/collections/user/mutations/register';
import resetPassword from 'src/server/collections/user/mutations/resetPassword';
import sendPasswordResetEmail from 'src/server/collections/user/mutations/sendPasswordResetEmail';
import aidRequestsIAmWorkingOn from 'src/server/collections/user/object_fields/aidRequestsIAmWorkingOn';
import crews from 'src/server/collections/user/object_fields/crews';
import taggableUsers from 'src/server/collections/user/object_fields/taggableUsers';
import username from 'src/server/collections/user/object_fields/username';
import me from 'src/server/collections/user/root_fields/me';
import resetPasswordLinkDetails from 'src/server/collections/user/root_fields/resetPasswordLinkDetails';
import { UserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';

UserGraphQLType.addFields({
  aidRequestsIAmWorkingOn,
  crews,
  taggableUsers,
  username,
});

const User = {
  MutationFields: {
    changeName,
    login,
    logout,
    register,
    resetPassword,
    sendPasswordResetEmail,
  },
  QueryFields: {
    me,
    resetPasswordLinkDetails,
  },
};

export default User;

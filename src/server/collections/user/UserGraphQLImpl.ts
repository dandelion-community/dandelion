import forgotPassword from 'src/server/collections/user/mutations/forgotPassword';
import login from 'src/server/collections/user/mutations/login';
import logout from 'src/server/collections/user/mutations/logout';
import register from 'src/server/collections/user/mutations/register';
import aidRequestsIAmWorkingOn from 'src/server/collections/user/object_fields/aidRequestsIAmWorkingOn';
import crews from 'src/server/collections/user/object_fields/crews';
import me from 'src/server/collections/user/root_fields/me';
import { UserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';

UserGraphQLType.addFields({
  aidRequestsIAmWorkingOn,
  crews,
});

const User = {
  MutationFields: {
    forgotPassword,
    login,
    logout,
    register,
  },
  QueryFields: {
    me,
  },
};

export default User;

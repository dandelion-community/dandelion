import login from './mutations/login';
import logout from './mutations/logout';
import register from './mutations/register';
import aidRequestsIAmWorkingOn from './object_fields/aidRequestsIAmWorkingOn';
import me from './root_fields/me';
import { UserGraphQLType } from './UserGraphQLTypes';

UserGraphQLType.addFields({
  aidRequestsIAmWorkingOn,
});

const User = {
  MutationFields: {
    login,
    logout,
    register,
  },
  QueryFields: {
    me,
  },
};

export default User;

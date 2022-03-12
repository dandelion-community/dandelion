import login from 'src/server/collections/user/mutations/login';
import logout from 'src/server/collections/user/mutations/logout';
import register from 'src/server/collections/user/mutations/register';
import aidRequestsIAmWorkingOn from 'src/server/collections/user/object_fields/aidRequestsIAmWorkingOn';
import crews from 'src/server/collections/user/object_fields/crews';
import taggableUsers from 'src/server/collections/user/object_fields/taggableUsers';
import username from 'src/server/collections/user/object_fields/username';
import me from 'src/server/collections/user/root_fields/me';
import { UserGraphQLType } from 'src/server/collections/user/UserGraphQLTypes';

UserGraphQLType.addFields({
  aidRequestsIAmWorkingOn,
  crews,
  taggableUsers,
  username,
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

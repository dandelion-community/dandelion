import type { ObjectId } from 'mongodb';
import { PassportLocalDocument, Schema } from 'mongoose';

declare global {
  namespace Express {
    interface User extends PassportLocalDocument {
      _id: ObjectId;
      aidRequestsIAmWorkingOn: Array<ObjectId>;
      username: string;
      displayName: string;
      crews: Array<string>;
    }
  }
}

export interface UserDocType extends PassportLocalDocument {
  password: string;
  username: string;
  aidRequestsIAmWorkingOn: Array<ObjectId>;
  displayName: string;
  crews: Array<string>;
}

export const UserReference = {
  ref: 'userInfo',
  type: Schema.Types.ObjectId,
};

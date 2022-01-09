import type { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: ObjectId;
      aidRequestsIAmWorkingOn: Array<ObjectId>;
      username: string;
    }
  }
}

export interface UserDocType {
  password: string;
  username: string;
  aidRequestsIAmWorkingOn: Array<ObjectId>;
}

export const UserReference = {
  ref: 'userInfo',
  type: Schema.Types.ObjectId,
};

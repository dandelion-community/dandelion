import type { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id: ObjectId;
      aidRequestsIAmWorkingOn: Array<ObjectId>;
      username: string;
      displayName: string;
      crews: Array<string>;
      passwordReset?: {
        token: string;
        expiry: Date;
      };
    }
  }
}

export interface UserDocType {
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

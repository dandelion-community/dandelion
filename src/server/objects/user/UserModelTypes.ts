declare global {
  namespace Express {
    interface User {
      _id: string;
      aidRequestsIAmWorkingOn: Array<string>;
      username: string;
    }
  }
}

export interface UserDocType {
  password: string;
  username: string;
  aidRequestsIAmWorkingOn: Array<string>;
}

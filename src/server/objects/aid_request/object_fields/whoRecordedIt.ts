import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { UserModel } from '../../user/UserModel';
import { AidRequestModel } from '../AidRequestModel';
import type { AidRequestType } from '../AidRequestModelTypes';

const whoRecordedIt: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Express.User | null> => {
    assertLoggedIn(req, 'whoRecordedIt');
    const aidRequest = await AidRequestModel.findById(aidRequestID);
    if (aidRequest == null) {
      return null;
    }
    const { whoRecordedIt, whoRecordedItUsername } = aidRequest;
    if (whoRecordedIt != null) {
      return await UserModel.findById(whoRecordedIt);
    } else {
      return await UserModel.findOne({ username: whoRecordedItUsername });
    }
  },
  type: 'User',
};

export default whoRecordedIt;

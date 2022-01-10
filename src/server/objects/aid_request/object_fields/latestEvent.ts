import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { UserModel } from '../../user/UserModel';
import { AidRequestModel } from '../AidRequestModel';
import type {
  AidRequestHistoryEventPayload,
  AidRequestType,
} from '../AidRequestModelTypes';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const latestEvent: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<string> => {
    assertLoggedIn(req, 'latestEvent');
    const aidRequest = await AidRequestModel.findById(_id);
    if (aidRequest == null) {
      throw new Error('No request found for this ID');
    }
    if (aidRequest.history.length === 0) {
      return 'No activity (yet!)';
    }
    const event = aidRequest.history.reduce((latestEvent, currentEvent) =>
      currentEvent.timestamp > latestEvent.timestamp
        ? currentEvent
        : latestEvent,
    );
    const user = await UserModel.findById(event.actor);
    if (user == null) {
      throw new Error('Action must have actor');
    }
    return `${timeAgo.format(event.timestamp)} - ${
      user.username
    } ${getActionText(event.details)}`;
  },
  type: 'String!',
};

function getActionText(details: AidRequestHistoryEventPayload): string {
  switch (details.event) {
    case 'WorkingOn':
      return 'started working on it';
    case 'Completed':
      return 'completed this';
  }
}

export default latestEvent;

import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { schemaComposer } from 'graphql-compose';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import type { ObjectId } from 'mongodb';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import { Person } from 'src/server/collections/user/UserGraphQLTypes';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import {
  maybeLoadMany,
  maybeLoadUserForViewer,
} from '../../user/loader/loadUserForViewer';

TimeAgo.addDefaultLocale(en);

type StatusSummary = {
  message: string;
  people: Person[];
};

export const StatusSummaryGraphQLType = schemaComposer.createObjectTC({
  fields: {
    message: 'String!',
    people: '[Person!]!',
  },
  name: 'StatusSummary',
});

const status: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<StatusSummary> => {
    const viewer = assertLoggedIn(req, 'AidRequest.status');
    const aidRequest = await loadAidRequestForViewer(viewer, aidRequestID);
    if (aidRequest.completed) {
      return await completedStatus(viewer, aidRequest);
    }

    const { whoIsWorkingOnIt } = aidRequest;
    if (whoIsWorkingOnIt.length > 0) {
      return await workingOnItStatus(viewer, aidRequest, whoIsWorkingOnIt);
    }

    return {
      message: 'No one is working on it yet',
      people: [],
    };
  },
  type: 'StatusSummary!',
};

async function completedStatus(
  viewer: Express.User,
  aidRequest: AidRequest,
): Promise<StatusSummary> {
  const completer = await getWhoCompletedThis(viewer, aidRequest);
  if (completer == null) {
    return {
      message: 'Completed',
      people: [],
    };
  } else {
    return {
      message: `Completed by ${completer.displayName}`,
      people: [completer],
    };
  }
}

async function getWhoCompletedThis(
  user: Express.User,
  aidRequest: AidRequest,
): Promise<Person | null> {
  const { history } = aidRequest;
  for (let i = history.length - 1; i >= 0; i--) {
    const event = history[i];
    if (event.event === 'Completed' && event.action === 'Add') {
      return await maybeLoadUserForViewer(user, event.actor.toString());
    }
  }
  return null;
}

async function workingOnItStatus(
  viewer: Express.User,
  aidRequest: AidRequest,
  whoIsWorkingOnIt: ObjectId[],
): Promise<StatusSummary> {
  const people = await maybeLoadMany(viewer, whoIsWorkingOnIt);
  switch (people.length) {
    case 0:
      return {
        message: 'Someone is working on it',
        people,
      };
    case 1:
      return {
        message: `${people[0].displayName} is working on it`,
        people,
      };
    case 2:
      return {
        message: `${people[0].displayName} and ${people[1].displayName} are working on it`,
        people,
      };
    default:
      return {
        message: `${people.length} people are working on it`,
        people,
      };
  }
}

export default status;

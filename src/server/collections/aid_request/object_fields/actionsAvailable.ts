import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type { AidRequestActionOption } from 'src/server/collections/aid_request/AidRequestModelTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

const actionsAvailable: ObjectTypeComposerFieldConfigAsObjectDefinition<
  AidRequest,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id: aidRequestID }: AidRequest,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<AidRequestActionOption>> => {
    const user = assertLoggedIn(req, 'AidRequest.actionsAvailable');
    const aidRequest = await loadAidRequestForViewer(user, aidRequestID);
    const isCreator = new ObjectId(aidRequest.whoRecordedIt).equals(user._id);
    const options: Array<AidRequestActionOption> = [
      aidRequest.completed
        ? markAsNotCompletedOption()
        : markAsCompletedOption(),
      aidRequest.whoIsWorkingOnIt.includes(user._id)
        ? iAmNotWorkingOnItOption()
        : iAmWorkingOnItOption(),
      ...(isCreator ? [deleteOption()] : []),
    ];
    return options;
  },
  type: '[AidRequestActionOption]',
};

function markAsNotCompletedOption(): AidRequestActionOption {
  return {
    icon: 'uncheck',
    input: {
      action: 'Remove',
      details: {
        event: 'Completed',
      },
    },
    message: 'Mark as incomplete',
  };
}

function markAsCompletedOption(): AidRequestActionOption {
  return {
    icon: 'check',
    input: {
      action: 'Add',
      details: {
        event: 'Completed',
      },
    },
    message: 'Mark as complete',
  };
}

function iAmWorkingOnItOption(): AidRequestActionOption {
  return {
    icon: 'raised-hand',
    input: {
      action: 'Add',
      details: {
        event: 'WorkingOn',
      },
    },
    message: "I'm working on it",
  };
}

function iAmNotWorkingOnItOption(): AidRequestActionOption {
  return {
    icon: 'x',
    input: {
      action: 'Remove',
      details: {
        event: 'WorkingOn',
      },
    },
    message: "I'm not working on it",
  };
}

function deleteOption(): AidRequestActionOption {
  return {
    icon: 'delete',
    input: {
      action: 'Add',
      details: {
        event: 'Deleted',
      },
    },
    message: 'Delete',
  };
}

export default actionsAvailable;

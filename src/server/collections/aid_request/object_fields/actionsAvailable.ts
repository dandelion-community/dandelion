import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestModel } from '../AidRequestModel';
import type {
  AidRequestActionOption,
  AidRequestType,
} from '../AidRequestModelTypes';

const actionsAvailable: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<AidRequestActionOption>> => {
    const user = assertLoggedIn(req, 'actionsAvailable');
    const aidRequest = await AidRequestModel.findById(_id);
    if (aidRequest == null) {
      return [];
    }
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

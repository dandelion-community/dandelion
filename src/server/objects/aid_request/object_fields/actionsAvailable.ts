import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
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
    const options: Array<AidRequestActionOption> = [
      aidRequest.completed
        ? markAsNotCompletedOption()
        : markAsCompletedOption(),
      aidRequest.whoIsWorkingOnIt.includes(user._id)
        ? iAmNotWorkingOnItOption()
        : iAmWorkingOnItOption(),
    ];
    return options;
  },
  type: '[AidRequestActionOption]',
};

function markAsNotCompletedOption(): AidRequestActionOption {
  return {
    input: {
      action: 'Remove',
      details: {
        event: 'Completed',
      },
    },
    message: 'This is not completed',
  };
}

function markAsCompletedOption(): AidRequestActionOption {
  return {
    input: {
      action: 'Add',
      details: {
        event: 'Completed',
      },
    },
    message: 'This is completed',
  };
}

function iAmWorkingOnItOption(): AidRequestActionOption {
  return {
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
    input: {
      action: 'Remove',
      details: {
        event: 'WorkingOn',
      },
    },
    message: "I'm not working on it",
  };
}

export default actionsAvailable;

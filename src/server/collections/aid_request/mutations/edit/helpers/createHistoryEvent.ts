import { nanoid } from 'nanoid';
import type { AidRequestHistoryEvent } from 'src/server/collections/aid_request/AidRequestModelTypes';
import isUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import type { UpdateArgs } from 'src/server/collections/aid_request/mutations/edit/UpdateType';

type HistoryEventArgs = {
  supportsUndo: boolean;
};

export default function createHistoryEvent(
  args: UpdateArgs,
  { supportsUndo }: HistoryEventArgs,
): AidRequestHistoryEvent {
  const { action, event, eventSpecificData } = args.input;
  const canUndo = supportsUndo && !isUndo(args);
  return {
    action,
    actor: args.user._id,
    event,
    eventSpecificData,
    timestamp: new Date(),
    undoID: canUndo ? nanoid() : null,
  };
}

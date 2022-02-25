import type { UpdateQuery } from 'mongoose';
import type {
  AidRequestHistoryEvent,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import isUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import type { UpdateArgs } from 'src/server/collections/aid_request/mutations/edit/UpdateType';

export default function getHistoryUpdate(
  args: UpdateArgs,
  historyEvent: AidRequestHistoryEvent,
): UpdateQuery<AidRequestType> {
  return isUndo(args)
    ? { $pull: { history: { undoID: args.undoID } } }
    : { $push: { history: historyEvent } };
}

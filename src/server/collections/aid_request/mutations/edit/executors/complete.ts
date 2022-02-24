import createHistoryEvent from 'src/server/collections/aid_request/mutations/edit/helpers/createHistoryEvent';
import isUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import updateAidRequest from 'src/server/collections/aid_request/mutations/edit/helpers/updateAidRequest';
import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';

export default async function complete(
  args: UpdateArgs,
): Promise<UpdateResult> {
  const isAdd = args.input.action === 'Add';
  const historyEvent = createHistoryEvent(args, { supportsUndo: true });

  const historyUpdate = isUndo(args)
    ? { $pull: { history: { undoID: args.undoID } } }
    : { $push: { history: historyEvent } };

  const completedFieldUpdate = {
    completed: isAdd !== isUndo(args),
  };

  const aidRequest = await updateAidRequest(args.aidRequestID, {
    ...historyUpdate,
    ...completedFieldUpdate,
  });

  const postpublishSummary = isAdd
    ? 'Marked as complete'
    : 'Marked as incomplete';

  return { aidRequest, historyEvent, postpublishSummary };
}

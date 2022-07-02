import { ObjectId } from 'mongodb';
import createHistoryEvent from 'src/server/collections/aid_request/mutations/edit/helpers/createHistoryEvent';
import getHistoryUpdate from 'src/server/collections/aid_request/mutations/edit/helpers/getHistoryUpdate';
import getIsUndo from 'src/server/collections/aid_request/mutations/edit/helpers/getIsUndo';
import updateAidRequest from 'src/server/collections/aid_request/mutations/edit/helpers/updateAidRequest';
import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';
import notify from 'src/server/notifications/notify';
import afterRequestIsComplete from 'src/server/utils/afterRequestIsComplete';
import updateReminderBecauseThereWasActivity from './updateReminderBecauseThereWasActivity';

export default async function comment(args: UpdateArgs): Promise<UpdateResult> {
  const isAdd = args.input.action === 'Add';
  const isUndo = getIsUndo(args);

  if (!isAdd) {
    throw new Error('editAidRequest only supports Add action for Comments');
  }

  const historyEvent = createHistoryEvent(args, { supportsUndo: true });
  const historyUpdate = getHistoryUpdate(args, historyEvent);
  const postpublishSummary = 'Added comment';
  const aidRequest = await updateAidRequest(args.aidRequestID, historyUpdate);

  if (!isUndo) {
    notify({
      aidRequest,
      comment: historyEvent,
      commenter: args.user,
      req: args.req,
      type: 'NewComment',
    });
  }

  if (!isUndo) {
    afterRequestIsComplete({
      callback: () =>
        updateReminderBecauseThereWasActivity({
          aidRequestID: new ObjectId(args.aidRequestID),
          userID: args.user._id,
        }),
      loggingTag: 'comment:updateReminderBecauseThereWasActivity',
      req: args.req,
    });
  }

  return { aidRequest, historyEvent, postpublishSummary };
}

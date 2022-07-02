import { ObjectId } from 'mongodb';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import getHistoryEventSummary from 'src/server/collections/aid_request/helpers/getHistoryEventSummary';
import createHistoryEvent from 'src/server/collections/aid_request/mutations/edit/helpers/createHistoryEvent';
import getHistoryUpdate from 'src/server/collections/aid_request/mutations/edit/helpers/getHistoryUpdate';
import updateAidRequest from 'src/server/collections/aid_request/mutations/edit/helpers/updateAidRequest';
import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';
import afterRequestIsComplete from 'src/server/utils/afterRequestIsComplete';
import getIsUndo from '../helpers/getIsUndo';
import updateReminderBecauseThereWasActivity from './updateReminderBecauseThereWasActivity';

type StringFieldSpecs = {
  fieldName: keyof AidRequest;
};

export default async function changeStringField(
  args: UpdateArgs,
  { fieldName }: StringFieldSpecs,
): Promise<UpdateResult> {
  const isUndo = getIsUndo(args);
  let newValue: string = args.input.eventSpecificData ?? 'unknown';
  const oldValue = args.originalAidRequest[fieldName];
  if (!newValue && !isUndo) {
    throw new Error(`Cannot change ${fieldName} to empty string`);
  }

  if (!isUndo && oldValue === newValue) {
    return {
      aidRequest: args.originalAidRequest,
      historyEvent:
        args.originalAidRequest.history[
          args.originalAidRequest.history.length - 1
        ],
      postpublishSummary: '',
    };
  }

  if (isUndo) {
    const historyEvent = args.originalAidRequest.history.find(
      (historyEvent) => historyEvent.undoID === args.undoID,
    );
    newValue = historyEvent?.oldValue ?? 'unknown';
  }

  const historyEvent = {
    ...createHistoryEvent(args, { supportsUndo: true }),
    newValue,
    oldValue,
  };
  const historyUpdate = getHistoryUpdate(args, historyEvent);

  const fieldUpdate = {
    [fieldName]: newValue,
  };

  const aidRequest = await updateAidRequest(args.aidRequestID, {
    ...historyUpdate,
    ...fieldUpdate,
  });

  const postpublishSummary = await getHistoryEventSummary(
    args.user,
    historyEvent,
  );

  if (!isUndo) {
    afterRequestIsComplete({
      callback: () =>
        updateReminderBecauseThereWasActivity({
          aidRequestID: new ObjectId(args.originalAidRequest._id),
          userID: args.user._id,
        }),
      loggingTag: 'changeStringField:updateReminderBecauseThereWasActivity',
      req: args.req,
    });
  }

  return { aidRequest, historyEvent, postpublishSummary };
}

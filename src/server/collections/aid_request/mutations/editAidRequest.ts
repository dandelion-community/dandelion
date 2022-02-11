import type { UpdateQuery } from 'mongoose';
import { nanoid } from 'nanoid';
import analytics from 'src/server/analytics';
import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import {
  AidRequestActionInputInputType,
  AidRequestHistoryEventGraphQLType,
} from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type {
  AidRequestActionInput,
  AidRequestHistoryEvent,
  AidRequestHistoryEventForGraphQL,
  AidRequestType,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import deleteAidRequest from 'src/server/collections/aid_request/mutations/deleteAidRequest';
import workingOn from 'src/server/collections/aid_request/mutations/workingOn';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import notifyListenersAboutAidRequestUpdate from 'src/server/notifications/notifyListenersAboutAidRequestUpdate';

async function editAidRequestResolver(
  _: unknown,
  {
    aidRequestID,
    input,
    undoID,
  }: {
    aidRequestID: string;
    input: AidRequestActionInput;
    undoID: string | null;
  },
  req: Express.Request,
): Promise<AidRequestHistoryEventForGraphQL | null> {
  const user = assertLoggedIn(req, 'editAidRequest');
  const originalAidRequest = await loadAidRequestForViewer(user, aidRequestID);
  const whatIsNeeded = originalAidRequest?.whatIsNeeded ?? '';
  const whoIsItFor = originalAidRequest?.whoIsItFor ?? '';
  const requestCrew = originalAidRequest?.crew ?? '';
  const { postpublishSummary, updater, onSuccess, historyEvent } =
    await getUpdateInfo(user, aidRequestID, input, undoID);
  let aidRequest: null | AidRequest = null;
  if (updater != null) {
    aidRequest = await AidRequestModel.findByIdAndUpdate(
      aidRequestID,
      updater,
      {
        new: true,
      },
    );
  }
  onSuccess?.(aidRequest);
  analytics.track({
    event: 'Edited Aid Request',
    properties: {
      action: input.action,
      aidRequestID,
      canUndo: historyEvent.undoID != null ? 'true' : 'false',
      event: input.event,
      isUndo: undoID != null ? 'true' : 'false',
      postpublishSummary,
      requestCrew,
      whatIsNeeded,
      whoIsItFor,
    },
    user,
  });
  return {
    ...historyEvent,
    actor: async () => user,
    aidRequest: async () => aidRequest,
    postpublishSummary,
  };
}

const editAidRequest = {
  args: {
    aidRequestID: 'String!',
    input: AidRequestActionInputInputType,
    undoID: 'String',
  },
  resolve: editAidRequestResolver,
  type: AidRequestHistoryEventGraphQLType,
};

export default editAidRequest;

type UpdateInfo = {
  updater: null | UpdateQuery<AidRequestType>;
  postpublishSummary: string;
  historyEvent: AidRequestHistoryEvent;
  onSuccess?: (aidRequest: AidRequest | null) => void;
};

async function getUpdateInfo(
  user: Express.User,
  aidRequestID: string,
  input: AidRequestActionInput,
  undoID: string | null,
): Promise<UpdateInfo> {
  const { action, event, eventSpecificData } = input;
  const historyEvent = {
    action,
    actor: user._id,
    event,
    eventSpecificData,
    timestamp: new Date(),
    undoID: nanoid(),
  };
  switch (event) {
    case 'Created':
      throw new Error('Cannot create an aid request through editAidRequest');
    case 'WorkingOn':
      return await (async (): Promise<UpdateInfo> => {
        const updater = await workingOn(
          user,
          aidRequestID,
          action,
          undoID,
          historyEvent,
        );
        const postpublishSummary =
          action === 'Add'
            ? "You're working on this"
            : "You're not working on this";
        return { historyEvent, postpublishSummary, updater };
      })();
    case 'Completed':
      return (() => {
        const historyUpdate =
          undoID == null
            ? { $push: { history: historyEvent } }
            : { $pull: { history: { undoID } } };
        const updater = {
          ...historyUpdate,
          completed: (action === 'Add') === (undoID == null),
        };
        const postpublishSummary =
          action === 'Add' ? 'Marked as complete' : 'Marked as incomplete';
        return { historyEvent, postpublishSummary, updater };
      })();
    case 'Deleted':
      await deleteAidRequest(user, aidRequestID, historyEvent, action, undoID);
      return {
        historyEvent: { ...historyEvent, undoID: null },
        postpublishSummary: 'Deleted',
        updater: null,
      };
    case 'Comment':
      if (action !== 'Add') {
        throw new Error('editAidRequest only supports Add action for Comments');
      }
      return (() => {
        const updater =
          undoID == null
            ? { $push: { history: historyEvent } }
            : { $pull: { history: { undoID } } };
        const postpublishSummary = 'Added comment';
        return {
          historyEvent,
          onSuccess: (aidRequest: AidRequest | null) => {
            const content = historyEvent.eventSpecificData;
            if (aidRequest != null && !!content) {
              notifyListenersAboutAidRequestUpdate({
                actor: user,
                aidRequest,
                content,
                verb: 'commented',
              });
            }
          },
          postpublishSummary,
          updater,
        };
      })();
  }
}

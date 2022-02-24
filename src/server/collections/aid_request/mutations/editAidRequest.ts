import analytics from 'src/server/analytics';
import {
  AidRequest,
  AidRequestActionInputInputType,
  AidRequestHistoryEventGraphQLType,
} from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import type {
  AidRequestActionInput,
  AidRequestHistoryEventForGraphQL,
} from 'src/server/collections/aid_request/AidRequestModelTypes';
import getComputedFields from 'src/server/collections/aid_request/computed_fields/getComputedFields';
import loadAidRequestForViewer from 'src/server/collections/aid_request/helpers/loadAidRequestForViewer';
import comment from 'src/server/collections/aid_request/mutations/edit/executors/comment';
import complete from 'src/server/collections/aid_request/mutations/edit/executors/complete';
import delete_ from 'src/server/collections/aid_request/mutations/edit/executors/delete';
import workingOn from 'src/server/collections/aid_request/mutations/edit/executors/workingOn';
import updateAidRequest from 'src/server/collections/aid_request/mutations/edit/helpers/updateAidRequest';
import {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';

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
  const {
    postpublishSummary,
    aidRequest: updatedAidRequest,
    historyEvent,
  } = await executeUpdate({
    aidRequestID,
    input,
    undoID,
    user,
  });
  let aidRequest: AidRequest | null = updatedAidRequest;
  if (aidRequest != null) {
    const computedFields = await getComputedFields(aidRequest);
    aidRequest = await updateAidRequest(aidRequestID, computedFields);
  }
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

async function executeUpdate(args: UpdateArgs): Promise<UpdateResult> {
  switch (args.input.event) {
    case 'Created':
      throw new Error('Cannot create an aid request through editAidRequest');
    case 'WorkingOn':
      return await workingOn(args);
    case 'Completed':
      return await complete(args);
    case 'Deleted':
      return await delete_(args);
    case 'Comment':
      return await comment(args);
  }
}

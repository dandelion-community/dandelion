import type { MutationTuple } from '@apollo/client';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import { isDraftID } from 'src/client/aid_request/drafts/AidRequestDraftIDs';
import { deleteAidRequestDraft } from 'src/client/aid_request/drafts/AidRequestDrafts';
import {
  EditAidRequestMutation,
  EditAidRequestMutationVariables,
} from 'src/client/aid_request/edit/__generated__/editAidRequestMutation';

export default async function editAidRequest(
  runEditAidRequestMutation: MutationTuple<
    EditAidRequestMutation,
    EditAidRequestMutationVariables
  >[0],
  variables: EditAidRequestMutationVariables,
): Promise<{ data: EditAidRequestMutation | null | undefined }> {
  if (isDraftID(variables.aidRequestID)) {
    return editDraftAidRequest(variables);
  } else {
    const { data } = await runEditAidRequestMutation({ variables });
    return { data };
  }
}

function editDraftAidRequest(variables: EditAidRequestMutationVariables): {
  data: EditAidRequestMutation | null | undefined;
} {
  const { aidRequestID, input, undoID } = variables;
  if (undoID != null) {
    throw new Error('Draft requests do not support undo');
  }
  const { action, event } = input;
  if (action !== AidRequestUpdateActionType.Add) {
    throw new Error('Draft request edit only supports Add action');
  }
  if (event !== AidRequestHistoryEventType.Deleted) {
    throw new Error('Draft request edit only supports Delete event');
  }
  deleteAidRequestDraft(aidRequestID);

  return {
    data: {
      payload: {
        __typename: 'AidRequestHistoryEvent',
        object: null,
        postpublishSummary: 'Deleted draft',
        undoID: null,
      },
    },
  };
}

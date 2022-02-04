import { useMutation } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import { AidRequestHistoryEventType } from 'src/../__generated__/globalTypes';
import { broadcastUpdatedAidRequest } from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
import { GoToRequestDetailScreen } from 'src/client/aid_request/detail/AidRequestDetailScreen';
import editAidRequest from 'src/client/aid_request/edit/editAidRequest';
import { EDIT_AID_REQUEST_MUTATION } from 'src/client/aid_request/edit/EditAidRequestMutation';
import {
  EditAidRequestMutation,
  EditAidRequestMutationVariables,
} from 'src/client/aid_request/edit/__generated__/editAidRequestMutation';
import Icon from 'src/client/components/Icon';
import useDialogContext from 'src/client/dialog/useDialogContext';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import client from 'src/client/graphql/client';
import useToastContext from 'src/client/toast/useToastContext';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';
import filterNulls from 'src/shared/utils/filterNulls';
import { isDraftID } from '../aid_request/drafts/AidRequestDraftIDs';
import { publishDraft } from '../aid_request/drafts/AidRequestDrafts';
import type {
  AidRequestEditDrawerFragment,
  AidRequestEditDrawerFragment_actionsAvailable,
  AidRequestEditDrawerFragment_actionsAvailable_input,
} from './__generated__/AidRequestEditDrawerFragment';

type Props = {
  aidRequest: AidRequestEditDrawerFragment;
  goToRequestDetailScreen?: GoToRequestDetailScreen;
};

type Item =
  | AidRequestEditDrawerFragment_actionsAvailable
  | 'View details'
  | 'Publish';

export default function AidRequestEditDrawer({
  aidRequest,
  goToRequestDetailScreen,
}: Props): JSX.Element {
  const [loadingPublish, setLoadingPublish] = React.useState<boolean>(false);
  const { publishToast } = useToastContext();
  const { closeDrawer } = useDrawerContext();
  const { shouldDelete } = useDialogContext();
  const { actionsAvailable, _id: aidRequestID } = aidRequest;
  const actions = filterNulls(actionsAvailable ?? []);
  const [runEditAidRequestMutation, editAidRequestMutationState] = useMutation<
    EditAidRequestMutation,
    EditAidRequestMutationVariables
  >(EDIT_AID_REQUEST_MUTATION);
  const { loading, error } = editAidRequestMutationState;
  const extraActions: Array<Item> = [
    ...(goToRequestDetailScreen == null || isDraftID(aidRequest._id)
      ? []
      : (['View details'] as Array<Item>)),
    ...(isDraftID(aidRequest._id) ? (['Publish'] as Array<Item>) : []),
  ];

  return loading || loadingPublish ? (
    <DebouncedLoadingIndicator />
  ) : (
    <>
      {error == null ? null : <Paragraph>{error.message}</Paragraph>}
      <FlatList
        data={[...actions, ...extraActions]}
        keyExtractor={extractKey}
        renderItem={renderItem}
      />
    </>
  );

  function renderItem({
    item: action,
  }: ListRenderItemInfo<Item>): React.ReactElement {
    if (action === 'View details') {
      return (
        <List.Item
          left={() => <Icon path="more" />}
          onPress={
            goToRequestDetailScreen == null
              ? undefined
              : () => {
                  closeDrawer();
                  goToRequestDetailScreen(aidRequest._id);
                }
          }
          title={action}
        />
      );
    }
    if (action === 'Publish') {
      return (
        <List.Item
          left={() => <Icon path="publish" />}
          onPress={async () => {
            setLoadingPublish(true);
            const message = await publishDraft(aidRequest._id);
            setLoadingPublish(false);
            closeDrawer();
            publishToast({ message });
          }}
          title={action}
        />
      );
    }
    const { icon } = action;
    return (
      <List.Item
        left={() => <Icon path={icon} />}
        onPress={() => mutate(action.input)}
        title={action.message}
      />
    );
  }

  async function mutate(
    input: AidRequestEditDrawerFragment_actionsAvailable_input,
  ): Promise<void> {
    if (input.event === AidRequestHistoryEventType.Deleted) {
      const shouldContinue = await shouldDelete();
      if (!shouldContinue) {
        return;
      }
    }

    const variables = {
      aidRequestID,
      input: {
        action: input.action,
        event: input.event,
      },
    };
    const { data } = await editAidRequest(runEditAidRequestMutation, variables);
    broadcastUpdatedAidRequest(aidRequestID, data?.editAidRequest?.aidRequest);
    closeDrawer();
    const editAidRequestResponse = data?.editAidRequest;
    if (editAidRequestResponse != null) {
      const { undoID } = editAidRequestResponse;
      publishToast({
        message: editAidRequestResponse.postpublishSummary || 'Updated',
        undo:
          undoID == null
            ? null
            : async () => {
                const { data } = await client.mutate({
                  mutation: EDIT_AID_REQUEST_MUTATION,
                  variables: { ...variables, undoID },
                });
                broadcastUpdatedAidRequest(
                  aidRequestID,
                  data?.editAidRequest?.aidRequest,
                );
              },
      });
    }
  }
}

function extractKey(item: Item): string {
  if (item === 'View details') {
    return 'View details';
  } else if (item === 'Publish') {
    return 'Publish';
  } else {
    return item.message;
  }
}

import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import Icon from 'src/client/components/Icon';
import useDialogContext from 'src/client/dialog/useDialogContext';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import client from 'src/client/graphql/client';
import useToastContext from 'src/client/toast/useToastContext';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';
import { useLoggedInViewerID } from 'src/client/viewer/ViewerContext';
import { AidRequestUpdateStatusType } from '../../../__generated__/globalTypes';
import filterNulls from '../../shared/utils/filterNulls';
import { GoToRequestDetailScreen } from '../aid_request/detail/AidRequestDetailScreen';
import { AidRequestCardFragments } from './AidRequestCardFragments';
import { broadcastAidRequestUpdated } from './AidRequestFilterLocalCacheUpdater';
import type {
  AidRequestEditDrawerFragment,
  AidRequestEditDrawerFragment_actionsAvailable,
  AidRequestEditDrawerFragment_actionsAvailable_input,
} from './__generated__/AidRequestEditDrawerFragment';
import {
  editAidRequestMutation,
  editAidRequestMutationVariables,
} from './__generated__/editAidRequestMutation';

type Props = {
  aidRequest: AidRequestEditDrawerFragment;
  goToRequestDetailScreen: GoToRequestDetailScreen;
};

type Item = AidRequestEditDrawerFragment_actionsAvailable | 'View details';

export default function AidRequestEditDrawer({
  aidRequest,
  goToRequestDetailScreen,
}: Props): JSX.Element {
  const viewerID = useLoggedInViewerID();
  const { publishToast } = useToastContext();
  const { closeDrawer } = useDrawerContext();
  const { shouldDelete } = useDialogContext();
  const { actionsAvailable, _id: aidRequestID } = aidRequest;
  const actions = filterNulls(actionsAvailable ?? []);
  const [runEditAidRequestMutation, editAidRequestMutationState] = useMutation<
    editAidRequestMutation,
    editAidRequestMutationVariables
  >(EDIT_AID_REQUEST_MUTATION);
  const { loading, error } = editAidRequestMutationState;

  return loading ? (
    <DebouncedLoadingIndicator />
  ) : (
    <>
      {error == null ? null : <Paragraph>{error.message}</Paragraph>}
      <FlatList
        data={[...actions, 'View details']}
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
          onPress={() => {
            closeDrawer();
            goToRequestDetailScreen(aidRequest._id);
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
    if (input.details.event === AidRequestUpdateStatusType.Deleted) {
      const shouldContinue = await shouldDelete();
      if (!shouldContinue) {
        return;
      }
    }

    const variables = {
      aidRequestID,
      input: {
        action: input.action,
        details: {
          event: input.details.event,
        },
      },
    };
    const { data } = await runEditAidRequestMutation({ variables });
    broadcastAidRequestUpdated(aidRequestID, data?.editAidRequest?.aidRequest, {
      viewerID,
    });
    closeDrawer();
    const editAidRequest = data?.editAidRequest;
    if (editAidRequest != null) {
      const { undoID } = editAidRequest;
      publishToast({
        message: editAidRequest.postpublishSummary || 'Updated',
        undo:
          undoID == null
            ? null
            : async () => {
                const { data } = await client.mutate({
                  mutation: EDIT_AID_REQUEST_MUTATION,
                  variables: { ...variables, undoID },
                });
                broadcastAidRequestUpdated(
                  aidRequestID,
                  data?.editAidRequest?.aidRequest,
                  { viewerID },
                );
              },
      });
    }
  }
}

function extractKey(item: Item): string {
  if (item === 'View details') {
    return 'View details';
  } else {
    return item.message;
  }
}

const EDIT_AID_REQUEST_MUTATION = gql`
  mutation editAidRequestMutation(
    $aidRequestID: String!
    $input: AidRequestActionInputInput!
    $undoID: String
  ) {
    editAidRequest(
      aidRequestID: $aidRequestID
      input: $input
      undoID: $undoID
    ) {
      aidRequest {
        ...AidRequestCardFragment
      }
      undoID
      postpublishSummary
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

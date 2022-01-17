import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import { AidRequestUpdateStatusType } from '../../../../__generated__/globalTypes';
import filterNulls from '../../../shared/utils/filterNulls';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import useDialogContext from '../../general-purpose/dialog/useDialogContext';
import useDrawerContext from '../../general-purpose/drawer/useDrawerContext';
import useToastContext from '../../general-purpose/toast/useToastContext';
import DebouncedLoadingIndicator from '../../general-purpose/utils/DebouncedLoadingIndicator';
import client from '../graphql/client';
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
};

export default function AidRequestEditDrawer({
  aidRequest,
}: Props): JSX.Element {
  const { publishToast } = useToastContext();
  const { closeDrawer } = useDrawerContext();
  const { shouldDelete } = useDialogContext();
  const { actionsAvailable, _id: aidRequestID } = aidRequest;
  const actions = filterNulls(actionsAvailable ?? []);
  const scheme = useColorScheme();
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
        data={actions}
        keyExtractor={({ message }) => message}
        renderItem={renderItem}
      />
    </>
  );

  function renderItem({
    item: action,
  }: ListRenderItemInfo<AidRequestEditDrawerFragment_actionsAvailable>): React.ReactElement {
    const { icon } = action;
    return (
      <List.Item
        left={() => (
          <View style={styles.icon}>
            {icon == null ? null : (
              <Image
                source={{ uri: `/icons/${scheme}/${icon}.png` }}
                style={styles.icon}
              />
            )}
          </View>
        )}
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
    broadcastAidRequestUpdated(aidRequestID, data?.editAidRequest?.aidRequest);
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
                );
              },
      });
    }
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

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
  },
});

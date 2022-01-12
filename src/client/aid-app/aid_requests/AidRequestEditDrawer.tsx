import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import filterNulls from '../../../shared/utils/filterNulls';
import DebouncedLoadingIndicator from '../../general-purpose/utils/DebouncedLoadingIndicator';
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
        data={actions}
        keyExtractor={({ message }) => message}
        renderItem={renderItem}
      />
    </>
  );

  function renderItem({
    item: action,
  }: ListRenderItemInfo<AidRequestEditDrawerFragment_actionsAvailable>): React.ReactElement {
    return (
      <List.Item onPress={() => mutate(action.input)} title={action.message} />
    );
  }

  async function mutate(
    input: AidRequestEditDrawerFragment_actionsAvailable_input,
  ): Promise<void> {
    const { data } = await runEditAidRequestMutation({
      variables: {
        aidRequestID,
        input: {
          action: input.action,
          details: {
            event: input.details.event,
          },
        },
      },
    });
    broadcastAidRequestUpdated(data?.editAidRequest);
  }
}

const EDIT_AID_REQUEST_MUTATION = gql`
  mutation editAidRequestMutation(
    $aidRequestID: String!
    $input: AidRequestActionInputInput!
  ) {
    editAidRequest(aidRequestID: $aidRequestID, input: $input) {
      ...AidRequestCardFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

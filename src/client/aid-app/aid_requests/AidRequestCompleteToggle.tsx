import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { Paragraph, Switch } from 'react-native-paper';
import { AidRequestCardFragments } from './AidRequestCardFragments';
import AidRequestCardSection from './AidRequestCardSection';
import { broadcastAidRequestUpdated } from './AidRequestFilterLocalCacheUpdater';
import type { AidRequestIsCompleteToggleFragment } from './__generated__/AidRequestIsCompleteToggleFragment';
import type {
  updateIsAidRequestCompleteMutation,
  updateIsAidRequestCompleteMutationVariables,
} from './__generated__/updateIsAidRequestCompleteMutation';

type Props = {
  aidRequest: AidRequestIsCompleteToggleFragment;
};

export default function AidRequestIsCompleteToggle({
  aidRequest,
}: Props): JSX.Element {
  const { _id: id, completed } = aidRequest;
  const [
    runUpdateIsRequestCompleteMutation,
    updateIsRequestCompleteMutationState,
  ] = useMutation<
    updateIsAidRequestCompleteMutation,
    updateIsAidRequestCompleteMutationVariables
  >(UPDATE_IS_AID_REQUEST_COMPLETE_MUTATION);
  const [optimisticValue, setOptimisticValue] = React.useState<
    boolean | undefined
  >(undefined);
  const displayValue = optimisticValue ?? completed;
  const { loading, error } = updateIsRequestCompleteMutationState;
  const [displayError, setDisplayError] = React.useState<string | undefined>(
    undefined,
  );
  React.useEffect(() => {
    if (!loading) {
      setOptimisticValue(undefined);
    }
    if (error != null) {
      setDisplayError(error.message);
    }
  }, [loading, error]);
  return (
    <AidRequestCardSection>
      <AidRequestCardSection.Row justifyContent="space-between">
        <Paragraph>Completed</Paragraph>
        <Switch onValueChange={onToggleSwitch} value={displayValue ?? false} />
      </AidRequestCardSection.Row>
      {displayError == null ? null : <Paragraph>{displayError}</Paragraph>}
    </AidRequestCardSection>
  );

  async function onToggleSwitch(): Promise<void> {
    const newValue = !displayValue;
    setOptimisticValue(newValue);
    const { data } = await runUpdateIsRequestCompleteMutation({
      variables: {
        id,
        newValue,
      },
    });
    broadcastAidRequestUpdated(data?.updateIsAidRequestComplete);
  }
}

const UPDATE_IS_AID_REQUEST_COMPLETE_MUTATION = gql`
  mutation updateIsAidRequestCompleteMutation(
    $id: String!
    $newValue: Boolean!
  ) {
    updateIsAidRequestComplete(id: $id, newValue: $newValue) {
      ...AidRequestCardFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

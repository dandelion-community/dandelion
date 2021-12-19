import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Switch } from 'react-native-paper';
import { AidRequestCardFragments } from './AidRequestCardFragments';
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
    <View style={styles.isCompletedRow}>
      <Paragraph style={styles.label}>Completed</Paragraph>
      <Switch onValueChange={onToggleSwitch} value={displayValue ?? false} />
      {displayError == null ? null : <Paragraph>{displayError}</Paragraph>}
    </View>
  );

  function onToggleSwitch(): void {
    const newValue = !displayValue;
    runUpdateIsRequestCompleteMutation({
      variables: {
        id,
        newValue,
      },
    });
    setOptimisticValue(newValue);
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

const styles = StyleSheet.create({
  isCompletedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  label: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: 16,
  },
});

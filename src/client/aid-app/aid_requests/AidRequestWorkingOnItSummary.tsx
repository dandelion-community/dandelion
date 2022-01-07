import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import filterNulls from '../../../shared/utils/filterNulls';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import { useViewerUsername } from '../../general-purpose/viewer/ViewerContext';
import { AidRequestCardFragments } from './AidRequestCardFragments';
import AidRequestCardSection from './AidRequestCardSection';
import type { AidRequestWorkingOnItSummaryFragment } from './__generated__/AidRequestWorkingOnItSummaryFragment';
import type {
  updateWhetherIAmWorkingOnThisAidRequestMutation,
  updateWhetherIAmWorkingOnThisAidRequestMutationVariables,
} from './__generated__/updateWhetherIAmWorkingOnThisAidRequestMutation';

type Props = {
  aidRequest: AidRequestWorkingOnItSummaryFragment;
};

export default function AidRequestWorkingOnItSummary({
  aidRequest,
}: Props): JSX.Element {
  const { _id: aidRequestID, whoIsWorkingOnItUsers } = aidRequest;
  const viewerUsername = useViewerUsername();
  const amIAlreadyMarkedAsWorkingOnIt =
    whoIsWorkingOnItUsers?.some(
      (personWhoIsWorkingOnIt) =>
        personWhoIsWorkingOnIt?.username === viewerUsername,
    ) ?? false;

  const [
    runUpdateIsRequestCompleteMutation,
    updateIsRequestCompleteMutationState,
  ] = useMutation<
    updateWhetherIAmWorkingOnThisAidRequestMutation,
    updateWhetherIAmWorkingOnThisAidRequestMutationVariables
  >(UPDATE_WHETHER_I_AM_WORKING_ON_THIS_AID_REQUEST_MUTATION);
  const [optimisticAmIWorkingOnItValue, setOptimisticAmIWorkingOnItValue] =
    React.useState<boolean | undefined>(undefined);
  const displayValue = processOptimisticValue(
    optimisticAmIWorkingOnItValue,
    whoIsWorkingOnItUsers,
    amIAlreadyMarkedAsWorkingOnIt,
    viewerUsername,
  );
  const { loading, error } = updateIsRequestCompleteMutationState;
  const [displayError, setDisplayError] = React.useState<string | undefined>(
    undefined,
  );
  React.useEffect(() => {
    if (!loading) {
      setOptimisticAmIWorkingOnItValue(undefined);
    }
    if (error != null) {
      setDisplayError(error.message);
    }
  }, [loading, error]);
  return (
    <AidRequestCardSection>
      <AidRequestCardSection.Row>
        <Text>Who's working on it: {renderWhoIsWorkingOnItSoFar()}</Text>
      </AidRequestCardSection.Row>
      <AidRequestCardSection.Row>
        <View>{renderAddOrRemoveButton()}</View>
      </AidRequestCardSection.Row>
      <View>
        {displayError == null ? null : <Paragraph>{displayError}</Paragraph>}
      </View>
    </AidRequestCardSection>
  );

  function renderWhoIsWorkingOnItSoFar(): React.ReactElement {
    const displayList = displayValue ?? [];
    if (displayList.length === 0) {
      return <Text>No one yet.</Text>;
    } else {
      return (
        <Text>
          {filterNulls(displayList.map((node) => node?.username)).join(', ')}
        </Text>
      );
    }
  }

  function renderAddOrRemoveButton(): React.ReactElement {
    const displayIAmWorkingOnIt =
      optimisticAmIWorkingOnItValue ?? amIAlreadyMarkedAsWorkingOnIt;
    if (displayIAmWorkingOnIt) {
      return (
        <Button compact={true} onPress={() => mutate(false)}>
          Remove Me
        </Button>
      );
    } else {
      return (
        <Button compact={true} onPress={() => mutate(true)}>
          Add Me
        </Button>
      );
    }
  }

  function mutate(iAmWorkingOnIt: boolean): void {
    runUpdateIsRequestCompleteMutation({
      variables: {
        aidRequestID,
        iAmWorkingOnIt,
      },
    });
    setOptimisticAmIWorkingOnItValue(iAmWorkingOnIt);
  }
}

const UPDATE_WHETHER_I_AM_WORKING_ON_THIS_AID_REQUEST_MUTATION = gql`
  mutation updateWhetherIAmWorkingOnThisAidRequestMutation(
    $aidRequestID: String!
    $iAmWorkingOnIt: Boolean!
  ) {
    updateWhetherIAmWorkingOnThisAidRequest(
      aidRequestID: $aidRequestID
      iAmWorkingOnIt: $iAmWorkingOnIt
    ) {
      ...AidRequestCardFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

function processOptimisticValue(
  optimisticAmIWorkingOnItValue: boolean | undefined,
  whoIsWorkingOnItUsers: AidRequestWorkingOnItSummaryFragment['whoIsWorkingOnItUsers'],
  amIAlreadyMarkedAsWorkingOnIt: boolean,
  viewerUsername: string,
): AidRequestWorkingOnItSummaryFragment['whoIsWorkingOnItUsers'] {
  switch (optimisticAmIWorkingOnItValue) {
    case undefined:
      return whoIsWorkingOnItUsers;
    case true:
      if (amIAlreadyMarkedAsWorkingOnIt) {
        return whoIsWorkingOnItUsers;
      }
      return [
        ...(whoIsWorkingOnItUsers ?? []),
        { __typename: 'User', username: viewerUsername },
      ];
    case false:
      if (!amIAlreadyMarkedAsWorkingOnIt) {
        return whoIsWorkingOnItUsers;
      }
      return (whoIsWorkingOnItUsers ?? []).filter(
        (user) => user?.username !== viewerUsername,
      );
  }
}

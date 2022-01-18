import { gql, useMutation } from '@apollo/client';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { AidRequestCardFragments } from 'request_explorer/AidRequestCardFragments';
import { broadcastAidRequestUpdated } from 'request_explorer/AidRequestFilterLocalCacheUpdater';
import type {
  CreateAidRequestMutation,
  CreateAidRequestMutationVariables,
} from 'request_explorer/__generated__/CreateAidRequestMutation';
import useToastContext from 'toast/useToastContext';

export default function CreateRequestForm(): JSX.Element {
  const { publishToast } = useToastContext();
  const [whoIsItFor, setwhoIsItFor] = React.useState<string>('');
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string>('');
  const areInputsValid = whoIsItFor.length > 0 && whatIsNeeded.length > 0;
  const [runCreateRequestMutation, createRequestMutationState] = useMutation<
    CreateAidRequestMutation,
    CreateAidRequestMutationVariables
  >(CREATE_AID_REQUEST_MUTATION);
  const { loading, error } = createRequestMutationState;
  return (
    <>
      <TextInput
        autoComplete="off"
        label="Who is it for?"
        setValue={setwhoIsItFor}
        value={whoIsItFor}
      />
      <TextInput
        autoComplete="off"
        label="What is needed?"
        setValue={setWhatIsNeeded}
        value={whatIsNeeded}
      />
      <View style={styles.button}>
        <Button
          disabled={!areInputsValid}
          loading={loading}
          mode="contained"
          onPress={submit}
        >
          Submit
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </>
  );
  async function submit(): Promise<void> {
    publishToast(undefined);
    const variables = {
      whatIsNeeded,
      whoIsItFor,
    };
    setWhatIsNeeded('');
    const { data } = await runCreateRequestMutation({
      variables,
    });
    const aidRequest = data?.createAidRequest;
    if (aidRequest == null) {
      console.error('Failed to create aidRequest');
      return;
    }
    publishToast({
      message: `Recorded request: ${whatIsNeeded} for ${whoIsItFor}`,
    });
    broadcastAidRequestUpdated(aidRequest._id, aidRequest);
  }
}

const CREATE_AID_REQUEST_MUTATION = gql`
  mutation CreateAidRequestMutation(
    $whatIsNeeded: String!
    $whoIsItFor: String!
  ) {
    createAidRequest(whatIsNeeded: $whatIsNeeded, whoIsItFor: $whoIsItFor) {
      ...AidRequestCardFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
  },
});

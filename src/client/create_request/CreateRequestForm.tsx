import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';
import View from 'src/client/components/View';
import type {
  CreateAidRequestMutation,
  CreateAidRequestMutationVariables,
} from 'src/client/create_request/__generated__/CreateAidRequestMutation';
import { AidRequestCardFragments } from 'src/client/request_explorer/AidRequestCardFragments';
import { broadcastAidRequestUpdated } from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import useToastContext from 'src/client/toast/useToastContext';

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

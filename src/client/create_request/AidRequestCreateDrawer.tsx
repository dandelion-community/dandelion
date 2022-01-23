import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';
import type {
  CreateAidRequestMutation,
  CreateAidRequestMutationVariables,
} from 'src/client/create_request/__generated__/CreateAidRequestMutation';
import useDrawerContext from 'src/client/drawer/useDrawerContext';
import { AidRequestCardFragments } from 'src/client/request_explorer/AidRequestCardFragments';
import { broadcastAidRequestUpdated } from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import useToastContext from 'src/client/toast/useToastContext';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';

export default function AidRequestCreateDrawer(): JSX.Element {
  const { publishToast } = useToastContext();
  const { closeDrawer } = useDrawerContext();
  const { crews } = useLoggedInViewer();
  const [whoIsItFor, setwhoIsItFor] = React.useState<string>('');
  const [whatIsNeeded, setWhatIsNeeded] = React.useState<string>('');
  const [crew, setCrew] = React.useState<string>(crews[0] ?? 'None');
  const areInputsValid = whoIsItFor.length > 0 && whatIsNeeded.length > 0;
  const [runCreateRequestMutation, createRequestMutationState] = useMutation<
    CreateAidRequestMutation,
    CreateAidRequestMutationVariables
  >(CREATE_AID_REQUEST_MUTATION);
  const { loading, error } = createRequestMutationState;

  return (
    <View style={{ height: Dimensions.get('window').height - 50 }}>
      {crews.length <= 1 ? null : (
        <RadioButton.Group onValueChange={setCrew} value={crew}>
          {crews.map((crew) => (
            <Pressable key={crew} onPress={() => setCrew(crew)}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <RadioButton value={crew} />
                <Text>{crew}</Text>
              </View>
            </Pressable>
          ))}
        </RadioButton.Group>
      )}
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
      <View style={styles.buttonRow}>
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
        <View style={styles.button}>
          <Button disabled={loading} mode="text" onPress={closeDrawer}>
            Cancel
          </Button>
        </View>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </View>
  );
  async function submit(): Promise<void> {
    publishToast(undefined);
    const variables = {
      crew,
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
    closeDrawer();
  }
}

const CREATE_AID_REQUEST_MUTATION = gql`
  mutation CreateAidRequestMutation(
    $crew: String!
    $whatIsNeeded: String!
    $whoIsItFor: String!
  ) {
    createAidRequest(
      crew: $crew
      whatIsNeeded: $whatIsNeeded
      whoIsItFor: $whoIsItFor
    ) {
      ...AidRequestCardFragment
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

const styles = StyleSheet.create({
  button: {
    marginLeft: 15,
  },
  buttonRow: {
    flexDirection: 'row-reverse',
    marginTop: 15,
  },
});

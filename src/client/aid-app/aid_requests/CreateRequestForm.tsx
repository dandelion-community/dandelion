import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import client from '../../aid-app/graphql/client';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import TextInput from '../../general-purpose/components/TextInput';
import useToastContext from '../../general-purpose/toast/useToastContext';
import type {
  CreateAidRequestMutation,
  CreateAidRequestMutationVariables,
} from './__generated__/CreateAidRequestMutation';

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
    await runCreateRequestMutation({
      variables,
    });
    publishToast({
      message: `Recorded request: ${whatIsNeeded} for ${whoIsItFor}`,
    });
    await client.refetchQueries({ include: ['ListOfAidRequestsQuery'] });
  }
}

const CREATE_AID_REQUEST_MUTATION = gql`
  mutation CreateAidRequestMutation(
    $whatIsNeeded: String!
    $whoIsItFor: String!
  ) {
    createAidRequest(whatIsNeeded: $whatIsNeeded, whoIsItFor: $whoIsItFor) {
      _id
      createdAt
      whatIsNeeded
      whoIsItFor
      whoRecordedIt {
        username
      }
    }
  }
`;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
  },
});

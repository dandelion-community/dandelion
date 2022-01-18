import { gql, useMutation } from '@apollo/client';
import Text from 'components/Text';
import TextInput from 'components/TextInput';
import View from 'components/View';
import * as WebBrowser from 'expo-web-browser';
import { RootStackScreenProps } from 'navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import useSetRootNavigation from 'navigation/useSetRootNavigation';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import reloadViewer from 'viewer/reloadViewer';
import useHandleViewer from 'viewer/useHandleViewer';
import type { Register } from './__generated__/Register';

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccountScreen(
  props: RootStackScreenProps<'Create Account'>,
) {
  const { navigation } = props;
  useSetRootNavigation(navigation);
  useCreateCrumbtrailsToLandingScreenIfNeeded(
    props,
    'ThreeLinesMenuTabStackContainer',
    undefined,
  );
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [runRegisterMutation, registerMutationState] =
    useMutation<Register>(REGISTER_MUTATION);
  const { loading, error } = registerMutationState;
  useHandleViewer(navigation, 'Create Account', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const isEmailValid = /.+@.+\..+/.test(email);

  // Idk what the requirements from django are yet. Let's be permissive,
  // and render any errors we receive from the server.
  const isPasswordValid = password.length >= 8;
  const areInputsValid = isEmailValid && isPasswordValid;

  return (
    <View style={styles.container}>
      <TextInput
        autoComplete="email"
        label="Email"
        setValue={(value: string) => !loading && setEmail(value)}
        value={email}
      />
      <TextInput
        autoComplete="password"
        label="Password"
        secureTextEntry={true}
        setValue={(value: string) => !loading && setPassword(value)}
        value={password}
      />
      <View style={styles.button}>
        <Button
          disabled={!areInputsValid}
          loading={loading}
          mode="contained"
          onPress={createAccount}
        >
          Create Account
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </View>
  );

  function createAccount(): void {
    runRegisterMutation({ variables: { password, username: email } }).then(
      reloadViewer,
    );
  }
}

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      user {
        username
      }
    }
  }
`;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
  },
  container: {
    marginHorizontal: 20,
  },
});

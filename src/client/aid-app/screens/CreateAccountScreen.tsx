import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import TextInput from '../../general-purpose//components/TextInput';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import reloadViewer from '../../general-purpose/viewer/reloadViewer';
import useHandleViewer from '../../general-purpose/viewer/useHandleViewer';
import { useSetRootNavigation } from '../navigation/Navigation';
import { RootStackScreenProps } from '../navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from '../navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import type { Register } from './__generated__/Register';

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccountScreen(
  props: RootStackScreenProps<'Create Account'>,
) {
  const { navigation } = props;
  useSetRootNavigation(navigation);
  useCreateCrumbtrailsToLandingScreenIfNeeded(props, 'ThreeLinesMenu');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [runRegisterMutation, registerMutationState] =
    useMutation<Register>(REGISTER_MUTATION);
  const { loading, error } = registerMutationState;
  useHandleViewer(navigation, 'Create Account', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const isUsernameValid = username.length > 0;

  // Idk what the requirements from django are yet. Let's be permissive,
  // and render any errors we receive from the server.
  const isPasswordValid = password.length >= 8;
  const areInputsValid = isUsernameValid && isPasswordValid;

  return (
    <View style={styles.container}>
      <TextInput
        autoComplete="username"
        label="Username"
        setValue={(value: string) => !loading && setUsername(value)}
        value={username}
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
    runRegisterMutation({ variables: { password, username } }).then(
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

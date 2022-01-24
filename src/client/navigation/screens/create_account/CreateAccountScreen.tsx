import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';
import View from 'src/client/components/View';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'src/client/navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import reloadViewer from 'src/client/viewer/reloadViewer';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
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
  const isPasswordValid = password.length >= 8;
  const areInputsValid = isEmailValid && isPasswordValid;
  const hints = `${isEmailValid ? '' : 'Please enter a valid email address.'} ${
    isPasswordValid ? '' : 'Please use a password of at least 8 characters.'
  }`;

  return (
    <View style={styles.container}>
      <TextInput
        autoComplete="email"
        autoFocus={true}
        label="Email"
        setValue={(value: string) => !loading && setEmail(value)}
        value={email}
      />
      <TextInput
        autoComplete="password"
        autoFocus={false}
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
        <Paragraph>{hints}</Paragraph>
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

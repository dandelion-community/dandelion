import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import Text from 'src/client/components/Text';
import TextInput, { TextInputHandles } from 'src/client/components/TextInput';
import View from 'src/client/components/View';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'src/client/navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
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
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [runRegisterMutation, registerMutationState] =
    useMutation<Register>(REGISTER_MUTATION);
  const { loading, error } = registerMutationState;
  useHandleViewer(navigation, 'Create Account', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const emailRef = React.useRef<TextInputHandles | null>(null);
  const passwordRef = React.useRef<TextInputHandles | null>(null);
  const confirmPasswordRef = React.useRef<TextInputHandles | null>(null);

  const isEmailValid = /.+@.+\..+/.test(email);
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = password === confirmPassword;
  const areInputsValid =
    isEmailValid && isPasswordValid && isConfirmPasswordValid;
  const hints = `${isEmailValid ? '' : 'Please enter a valid email address.'} ${
    isPasswordValid ? '' : 'Please use a password of at least 8 characters.'
  } ${isConfirmPasswordValid ? '' : 'Passwords do not match.'}`;

  return (
    <ScrollableScreen
      configs={[
        singleElement({
          key: 'email',
          render: () => (
            <TextInput
              autoComplete="email"
              autoFocus={true}
              label="Email"
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
              ref={(ref) => {
                emailRef.current = ref;
              }}
              returnKeyType="next"
              setValue={(value: string) => !loading && setEmail(value)}
              value={email}
            />
          ),
        }),
        singleElement({
          key: 'password',
          render: () => (
            <TextInput
              autoComplete="password"
              autoFocus={false}
              label="Password"
              onSubmitEditing={() => {
                confirmPasswordRef.current?.focus();
              }}
              ref={(ref) => {
                passwordRef.current = ref;
              }}
              returnKeyType="next"
              setValue={(value: string) => !loading && setPassword(value)}
              value={password}
            />
          ),
        }),
        singleElement({
          key: 'confirmPassword',
          render: () => (
            <TextInput
              autoComplete="password"
              autoFocus={false}
              label="Confirm Password"
              onSubmitEditing={() => {
                if (areInputsValid) {
                  createAccount();
                }
              }}
              ref={(ref) => {
                confirmPasswordRef.current = ref;
              }}
              returnKeyType="go"
              setValue={(value: string) =>
                !loading && setConfirmPassword(value)
              }
              value={confirmPassword}
            />
          ),
        }),
        singleElement({
          key: 'create-account-button',
          render: () => (
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
          ),
        }),
        ...(error == null
          ? []
          : [
              singleElement({
                key: 'error-message',
                render: () => <Text>{error.message}</Text>,
              }),
            ]),
      ]}
    />
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

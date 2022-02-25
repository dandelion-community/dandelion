import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import EmailLink from 'src/client/components/EmailLink';
import TextInput, { TextInputHandles } from 'src/client/components/TextInput';
import View from 'src/client/components/View';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'src/client/navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import reloadViewer from 'src/client/viewer/reloadViewer';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
import getErrorMessage from 'src/shared/utils/error/getErrorMessage';
import type { Login } from './__generated__/Login';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen(props: RootStackScreenProps<'Login'>) {
  const { navigation } = props;
  useSetRootNavigation(navigation);
  useCreateCrumbtrailsToLandingScreenIfNeeded(
    props,
    'ThreeLinesMenuTabStackContainer',
    undefined,
  );

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [runLoginMutation, loginMutationState] =
    useMutation<Login>(LOGIN_MUTATION);
  const { loading, error } = loginMutationState;
  useHandleViewer(navigation, 'Login', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const emailRef = React.useRef<TextInputHandles | null>(null);
  const passwordRef = React.useRef<TextInputHandles | null>(null);

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
              onSubmitEditing={login}
              ref={(ref) => {
                passwordRef.current = ref;
              }}
              returnKeyType="go"
              setValue={(value: string) => !loading && setPassword(value)}
              value={password}
            />
          ),
        }),
        singleElement({
          key: 'login-button',
          render: () => (
            <View style={styles.button}>
              <Button loading={loading} mode="contained" onPress={login}>
                Login
              </Button>
            </View>
          ),
        }),
        ...(error == null
          ? []
          : [
              singleElement({
                key: 'error',
                render: () => (
                  <Paragraph>
                    {getErrorMessage(error)}. Please email{' '}
                    <EmailLink
                      slug="password.reset"
                      subject={`Dandelion Password Reset (${email})`}
                    />{' '}
                    if you need to reset your password. Email{' '}
                    <EmailLink
                      slug="support"
                      subject={`Login Support (${email})`}
                    />{' '}
                    if you need help with anything else.
                  </Paragraph>
                ),
              }),
            ]),
      ]}
    />
  );

  async function login(): Promise<void> {
    await runLoginMutation({
      variables: { password, username: email },
    });
    reloadViewer();
  }
}

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
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
});

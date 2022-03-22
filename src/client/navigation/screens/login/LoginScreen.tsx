import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import EmailLink from 'src/client/components/EmailLink';
import ErrorNotice from 'src/client/components/ErrorNotice';
import SuccessNotice from 'src/client/components/SuccessNotice';
import TextInput, { TextInputHandles } from 'src/client/components/TextInput';
import View from 'src/client/components/ViewWithBackground';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'src/client/navigation/helpers/useCreateCrumbtrailsToLandingScreenIfNeeded';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import type {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
} from 'src/client/navigation/screens/login/__generated__/SendPasswordResetEmail';
import ScrollableScreen from 'src/client/scrollable_screen/ScrollableScreen';
import singleElement from 'src/client/scrollable_screen/singleElement';
import reloadViewer from 'src/client/viewer/reloadViewer';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
import getErrorMessage from 'src/shared/utils/error/getErrorMessage';
import type { Login } from './__generated__/Login';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen(props: RootStackScreenProps<'Login'>) {
  const { navigation } = props;
  useCreateCrumbtrailsToLandingScreenIfNeeded(props, props.route.params);
  const { message, email: initialEmail } = props.route.params;

  const [email, setEmail] = React.useState(initialEmail ?? '');
  const [password, setPassword] = React.useState('');
  const [runLoginMutation, loginMutationState] =
    useMutation<Login>(LOGIN_MUTATION);
  const { loading: loginLoading, error: loginError } = loginMutationState;
  const [
    runSendPasswordResetEmailMutation,
    sendPasswordResetEmailMutationState,
  ] = useMutation<SendPasswordResetEmail, SendPasswordResetEmailVariables>(
    SEND_PASSWORD_RESET_EMAIL_MUTATION,
  );
  const {
    data: sendPasswordResetEmailData,
    loading: sendPasswordResetEmailLoading,
    error: sendPasswordResetEmailError,
  } = sendPasswordResetEmailMutationState;
  const loading = loginLoading || sendPasswordResetEmailLoading;

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
        ...(message == null
          ? []
          : [
              singleElement({
                key: 'message',
                render: () => (
                  <View style={styles.element}>
                    <SuccessNotice text={message} />
                  </View>
                ),
              }),
            ]),
        singleElement({
          key: 'email',
          render: () => (
            <View style={styles.element}>
              <TextInput
                autoComplete="email"
                autoFocus={!initialEmail}
                disabled={loading}
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
            </View>
          ),
        }),
        singleElement({
          key: 'password',
          render: () => (
            <View style={styles.element}>
              <TextInput
                autoComplete="password"
                autoFocus={!!initialEmail}
                disabled={loading}
                label="Password"
                onSubmitEditing={login}
                ref={(ref) => {
                  passwordRef.current = ref;
                }}
                returnKeyType="go"
                setValue={(value: string) => !loading && setPassword(value)}
                value={password}
              />
            </View>
          ),
        }),
        singleElement({
          key: 'login-button',
          render: () => (
            <View style={[styles.button, styles.element]}>
              <Button
                disabled={loading}
                loading={loginLoading}
                mode="contained"
                onPress={login}
              >
                Login
              </Button>
            </View>
          ),
        }),
        singleElement({
          key: 'forgot-password',
          render: () => (
            <View style={[styles.button, styles.element]}>
              <Button
                disabled={loading}
                loading={sendPasswordResetEmailLoading}
                mode="outlined"
                onPress={forgotPassword}
              >
                Forgot Password
              </Button>
            </View>
          ),
        }),
        ...(loginError == null
          ? []
          : [
              singleElement({
                key: 'login-error',
                render: () => (
                  <View style={styles.element}>
                    <Paragraph>
                      {getErrorMessage(loginError)}. Please use the 'Forgot
                      Password' button if you need to reset your password. Email{' '}
                      <EmailLink
                        emailUser="support"
                        subject={`Login Support (${email})`}
                      />{' '}
                      if you need help with anything.
                    </Paragraph>
                  </View>
                ),
              }),
            ]),
        singleElement({
          key: 'send-password-reset-email-error',
          render: () => (
            <View style={styles.element}>
              <ErrorNotice
                error={sendPasswordResetEmailError}
                manualChange={'create a password reset link for ' + email}
                whenTryingToDoWhat="send you a password reset email"
              />
            </View>
          ),
        }),
        singleElement({
          key: 'sendPasswordResetEmailData',
          render: () => (
            <View style={styles.element}>
              <SuccessNotice
                text={sendPasswordResetEmailData?.sendPasswordResetEmail}
              />
            </View>
          ),
        }),
      ]}
    />
  );

  async function login(): Promise<void> {
    await runLoginMutation({
      variables: { password, username: email },
    });
    reloadViewer();
  }

  async function forgotPassword(): Promise<void> {
    await runSendPasswordResetEmailMutation({
      variables: { username: email },
    });
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

export const SEND_PASSWORD_RESET_EMAIL_MUTATION = gql`
  mutation SendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(username: $username)
  }
`;

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
  },
  element: {
    marginHorizontal: 8,
  },
});

import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import Text from 'src/client/components/Text';
import TextInput, { TextInputHandles } from 'src/client/components/TextInput';
import View from 'src/client/components/View';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useCreateCrumbtrailsToLandingScreenIfNeeded from 'src/client/navigation/useCreateCrumbtrailsToLandingScreenIfNeeded';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import reloadViewer from 'src/client/viewer/reloadViewer';
import useHandleViewer from 'src/client/viewer/useHandleViewer';
import type { Login } from './__generated__/Login';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen(props: RootStackScreenProps<'Login'>) {
  const { navigation } = props;
  const linkColor = useColor('accent');
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
  const { data, loading, error } = loginMutationState;
  useHandleViewer(navigation, 'Login', {
    loggedIn: async (_, goToMain) => {
      goToMain();
    },
  });

  const emailRef = React.useRef<TextInputHandles | null>(null);
  const passwordRef = React.useRef<TextInputHandles | null>(null);

  return (
    <View style={styles.container}>
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
      <View style={styles.button}>
        <Button loading={loading} mode="contained" onPress={login}>
          Login
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
      {data != null && data?.login?.user == null ? (
        <Paragraph>
          User not found or password incorrect. Please email{' '}
          <Text
            onPress={() =>
              Linking.openURL(
                `mailto:password.reset@dandelion.supplies?subject=Dandelion Password Reset (${email})`,
              )
            }
            style={{ color: linkColor }}
          >
            lowell.organizing@gmail.com
          </Text>{' '}
          if you need to reset your password
        </Paragraph>
      ) : null}
    </View>
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
  container: {
    marginHorizontal: 20,
  },
});

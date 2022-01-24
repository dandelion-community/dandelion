import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Text from 'src/client/components/Text';
import TextInput from 'src/client/components/TextInput';
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
        <Button loading={loading} mode="contained" onPress={login}>
          Login
        </Button>
      </View>
      {error != null ? <Text>{error.message}</Text> : null}
    </View>
  );

  function login(): void {
    runLoginMutation({ variables: { password, username: email } }).then(
      reloadViewer,
    );
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

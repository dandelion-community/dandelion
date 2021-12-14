import { gql, useMutation } from '@apollo/client';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import TextInput from '../../general-purpose/components/TextInput';
import reloadViewer from '../../general-purpose/viewer/reloadViewer';
import useHandleViewer from '../../general-purpose/viewer/useHandleViewer';
import { RootStackScreenProps } from '../navigation/types';
import type { Login } from './__generated__/Login';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  const [username, setUsername] = React.useState('');
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
      <Button mode="contained" onPress={login}>
        Login
      </Button>
      {loading ? <ActivityIndicator /> : null}
      {error != null ? <Text>{error.message}</Text> : null}
    </View>
  );

  function login(): void {
    runLoginMutation({ variables: { loading, password } }).then(reloadViewer);
  }
}

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(username: $email, password: $password) {
      user {
        username
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

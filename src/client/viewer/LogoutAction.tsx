import { gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import CardButtonRow from 'src/client/components/CardButtonRow';
import client from 'src/client/graphql/client';
import { RootStackParamList } from 'src/client/navigation/NavigationTypes';
import reloadViewer from 'src/client/viewer/reloadViewer';

export default function LogoutOrRegisterActionsRow(): JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();
  return (
    <CardButtonRow
      buttons={[
        {
          onPress: logout,
          text: 'Sign out',
        },
      ]}
    />
  );
  async function logout(): Promise<void> {
    navigation.replace('NotLoggedIn');
    client.getObservableQueries().clear();
    await client.mutate({ mutation: LOGOUT_MUTATION, variables: {} });
    await client.clearStore();
    await reloadViewer();
  }
}

export const LOGOUT_MUTATION = gql`
  mutation LogoutActionMutation {
    logout {
      user {
        username
      }
    }
  }
`;

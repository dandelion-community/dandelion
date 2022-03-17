import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import { ProgressBar } from 'react-native-paper';
import CardButtonRow from 'src/client/components/CardButtonRow';
import Text from 'src/client/components/Text';
import client from 'src/client/graphql/client';
import reloadViewer from 'src/client/viewer/reloadViewer';
import type { LogoutActionMutation } from './__generated__/LogoutActionMutation';

export default function LogoutOrRegisterActionsRow(): JSX.Element {
  const [runLogoutMutation, logoutMutationState] =
    useMutation<LogoutActionMutation>(LOGOUT_MUTATION);
  const { loading, error } = logoutMutationState;
  const buttons = (
    <CardButtonRow
      buttons={[
        {
          loading,
          onPress: logout,
          text: 'Sign out',
        },
      ]}
    />
  );
  return loading ? (
    <ProgressBar indeterminate={true} />
  ) : error ? (
    <>
      {buttons}
      {error ? <Text>{error}</Text> : null}
    </>
  ) : (
    buttons
  );
  async function logout(): Promise<void> {
    await runLogoutMutation({ variables: {} });
    await client.cache.reset();
    await client.resetStore();
    reloadViewer();
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

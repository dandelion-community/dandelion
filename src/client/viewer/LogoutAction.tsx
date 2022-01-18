import { gql, useMutation } from '@apollo/client';
import CardButtonRow from 'components/CardButtonRow';
import Text from 'components/Text';
import DebouncedLoadingIndicator from 'utils/DebouncedLoadingIndicator';
import * as React from 'react';
import reloadViewer from 'viewer/reloadViewer';
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
    <DebouncedLoadingIndicator />
  ) : error ? (
    <>
      {buttons}
      {error ? <Text>{error}</Text> : null}
    </>
  ) : (
    buttons
  );
  function logout(): void {
    runLogoutMutation({ variables: {} }).then(reloadViewer);
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

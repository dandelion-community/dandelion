import { gql, useMutation } from '@apollo/client';
import * as React from 'react';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import DebouncedLoadingIndicator from '../../general-purpose/utils/DebouncedLoadingIndicator';
import reloadViewer from '../../general-purpose/viewer/reloadViewer';
import CardButtonRow from '../components/CardButtonRow';
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

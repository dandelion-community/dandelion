import useRootNavigation from 'navigation/useRootNavigation';
import CardButtonRow from 'components/CardButtonRow';
import * as React from 'react';

export default function LoginOrRegisterActionsRow(): JSX.Element {
  const rootNavigation = useRootNavigation();
  return (
    <CardButtonRow
      buttons={[
        {
          onPress: () => {
            rootNavigation.push('Login');
          },
          text: 'Log In',
        },
        {
          onPress: () => {
            rootNavigation.push('Create Account');
          },
          text: 'Sign Up',
        },
      ]}
    />
  );
}

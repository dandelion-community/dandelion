import * as React from 'react';
import CardButtonRow from 'src/client/components/CardButtonRow';
import useRootNavigation from 'src/client/navigation/useRootNavigation';

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

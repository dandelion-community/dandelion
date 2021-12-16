import * as React from 'react';
import { useRootNavigation } from '../../aid-app/navigation/Navigation';
import CardButtonRow from '../components/CardButtonRow';

export default function LoginOrRegisterActionsRow(): JSX.Element {
  const rootNavigation = useRootNavigation();
  return (
    <CardButtonRow
      buttons={[
        {
          onPress: () => {
            rootNavigation.push('Login');
          },
          text: 'Sign In',
        },
        {
          onPress: () => {
            rootNavigation.push('Create Account');
          },
          text: 'New Account',
        },
      ]}
    />
  );
}

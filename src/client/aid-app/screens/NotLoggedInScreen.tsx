import * as React from 'react';
import { StyleSheet } from 'react-native';
import Button from '../../general-purpose/components/Button';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import useHandleViewer from '../../general-purpose/viewer/useHandleViewer';
import { RootStackScreenProps } from '../navigation/NavigationTypes';
import useSetRootNavigation from '../navigation/useSetRootNavigation';

export default function NotLoggedInScreen({
  navigation,
}: RootStackScreenProps<'NotLoggedIn'>): JSX.Element {
  useSetRootNavigation(navigation);
  useHandleViewer(navigation, 'NotLoggedIn', {
    loggedIn: async (_, goToMain) => goToMain(),
  });
  return (
    <View style={styles.container}>
      <Text>Welcome to Community Aid App</Text>
      <Button
        onPress={() => {
          navigation.push('Create Account');
        }}
        text="Create Account"
      />
      <Button
        onPress={() => {
          navigation.push('Login');
        }}
        text="Login"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

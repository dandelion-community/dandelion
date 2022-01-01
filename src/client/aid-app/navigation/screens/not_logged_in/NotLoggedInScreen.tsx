import * as React from 'react';
import { StyleSheet } from 'react-native';
import CardButtonRow from '../../../../general-purpose/components/CardButtonRow';
import Text from '../../../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../../../general-purpose/components/light-or-dark-themed/View';
import useHandleViewer from '../../../../general-purpose/viewer/useHandleViewer';
import { RootStackScreenProps } from '../../NavigationTypes';
import useSetRootNavigation from '../../useSetRootNavigation';

export default function NotLoggedInScreen({
  navigation,
}: RootStackScreenProps<'NotLoggedIn'>): JSX.Element {
  useSetRootNavigation(navigation);
  useHandleViewer(navigation, 'NotLoggedIn', {
    loggedIn: async (_, goToMain) => goToMain(),
  });
  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>
        Welcome to Dandelion Community Aid
      </Text>
      <CardButtonRow
        buttons={[
          {
            onPress: () => {
              navigation.push('Create Account');
            },
            text: 'Create new account',
          },
        ]}
      />
      <CardButtonRow
        buttons={[
          {
            onPress: () => {
              navigation.push('Login');
            },
            text: 'Login to existing account',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  text: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
});

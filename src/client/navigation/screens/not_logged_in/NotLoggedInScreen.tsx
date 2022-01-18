import CardButtonRow from 'components/CardButtonRow';
import Text from 'components/Text';
import View from 'components/View';
import { RootStackScreenProps } from 'navigation/NavigationTypes';
import useSetRootNavigation from 'navigation/useSetRootNavigation';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import useHandleViewer from 'viewer/useHandleViewer';

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

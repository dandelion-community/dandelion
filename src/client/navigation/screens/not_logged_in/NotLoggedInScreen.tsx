import * as React from 'react';
import { StyleSheet } from 'react-native';
import CardButtonRow from 'src/client/components/CardButtonRow';
import Text from 'src/client/components/Text';
import View from 'src/client/components/View';
import { RootStackScreenProps } from 'src/client/navigation/NavigationTypes';
import useSetRootNavigation from 'src/client/navigation/useSetRootNavigation';
import useHandleViewer from 'src/client/viewer/useHandleViewer';

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

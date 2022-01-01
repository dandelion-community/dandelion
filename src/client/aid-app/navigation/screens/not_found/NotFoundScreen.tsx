import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../../../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../../../general-purpose/components/light-or-dark-themed/View';
import { RootStackScreenProps } from '../../NavigationTypes';
import useSetRootNavigation from '../../useSetRootNavigation';

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<'NotFound'>) {
  useSetRootNavigation(navigation);
  React.useEffect(() => {
    navigation.replace('Main');
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Main')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: '#2e78b7',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

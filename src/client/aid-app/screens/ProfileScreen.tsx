import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';

export default function ProfileScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.scrollView}>
          <Text>Here it is, the profile screen</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    margin: 10,
  },
  scrollView: {
    alignItems: 'stretch',
    flex: 1,
  },
});

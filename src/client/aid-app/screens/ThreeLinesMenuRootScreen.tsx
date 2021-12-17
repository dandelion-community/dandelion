import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import YourAccountMenuCard from '../../general-purpose/viewer/YourAccountMenuCard';

export default function ThreeLinesMenuRootScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.scrollView}>
          <YourAccountMenuCard />
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

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import RequireLoggedInScreen from '../../../../../general-purpose/components/RequireLoggedInScreen';
import YourAccountMenuCard from '../../../../../general-purpose/viewer/YourAccountMenuCard';
import AttributionCard from '../../../../menu/attribution/AttributionCard';
import DebugInfoCard from '../../../../menu/debug/DebugInfoCard';

export default function ThreeLinesMenuScreen(): JSX.Element {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <YourAccountMenuCard />
            <DebugInfoCard />
            <AttributionCard />
          </View>
        </ScrollView>
      </View>
    </RequireLoggedInScreen>
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

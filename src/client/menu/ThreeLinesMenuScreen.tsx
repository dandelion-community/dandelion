import View from 'components/View';
import AttributionCard from 'menu/attribution/AttributionCard';
import DebugInfoCard from 'menu/debug/DebugInfoCard';
import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RequireLoggedInScreen from 'viewer/RequireLoggedInScreen';
import YourAccountMenuCard from 'viewer/YourAccountMenuCard';

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

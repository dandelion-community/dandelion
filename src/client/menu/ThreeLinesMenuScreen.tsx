import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import AttributionCard from 'src/client/menu/attribution/AttributionCard';
import DebugInfoCard from 'src/client/menu/debug/DebugInfoCard';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import YourAccountMenuCard from 'src/client/viewer/YourAccountMenuCard';
import FeedbackCard from './FeedbackCard';
import SupportAppCard from './SupportAppCard';

export default function ThreeLinesMenuScreen(): JSX.Element {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <YourAccountMenuCard />
            <FeedbackCard />
            <SupportAppCard />
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

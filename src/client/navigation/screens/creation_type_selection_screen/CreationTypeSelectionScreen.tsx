import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import RootNavigationStore from '../../root/RootNavigationStore';
import CreationTypeSelectionButton from './CreationTypeSelectionButton';

export default function CreationTypeSelectionScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <CreationTypeSelectionButton
          onPress={() => {
            RootNavigationStore.getValue()?.push('Record Request');
          }}
          subtext="has one or more needs"
          text="One person"
        />
        <CreationTypeSelectionButton
          onPress={() => {
            RootNavigationStore.getValue()?.push(
              'Record Multi Person Request',
              {},
            );
          }}
          subtext="have the same need (e.g., propane)"
          text="Multiple People"
        />
      </View>
    </RequireLoggedInScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column-reverse',
    height: '100%',
    paddingBottom: 32,
  },
});

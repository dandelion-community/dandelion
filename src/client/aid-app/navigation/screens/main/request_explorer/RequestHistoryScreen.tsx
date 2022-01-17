import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import Text from '../../../../../general-purpose/components/light-or-dark-themed/Text';
import RequireLoggedInScreen from '../../../../../general-purpose/components/RequireLoggedInScreen';

export default function RequestHistoryScreen(): JSX.Element {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <Text>Here's the history of the request!</Text>
      </View>
    </RequireLoggedInScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
});

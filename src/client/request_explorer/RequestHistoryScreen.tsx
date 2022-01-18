import * as React from 'react';
import { StyleSheet } from 'react-native';
import Text from 'src/client/components/Text';
import View from 'src/client/components/View';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

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

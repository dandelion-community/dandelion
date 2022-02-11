import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import View from 'src/client/components/View';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';

export default function CreateRequestScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}></View>
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
  snackbar: {
    bottom: 0,
    elevation: 1,
    margin: 16,
    position: 'absolute',
  },
});

import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import RequireLoggedInScreen from '../../../../../general-purpose/components/RequireLoggedInScreen';
import CreateRequestForm from '../../../../aid_requests/CreateRequestForm';

export default function CreateRequestScreen(): React.ReactElement {
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <CreateRequestForm />
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
  snackbar: {
    bottom: 0,
    elevation: 1,
    margin: 16,
    position: 'absolute',
  },
});

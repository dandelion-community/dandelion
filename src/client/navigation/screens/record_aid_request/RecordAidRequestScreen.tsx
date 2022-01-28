import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import RecordAidRequestForm from 'src/client/create_request/RecordAidRequestForm';
import RequireLoggedInScreen from 'src/client/viewer/RequireLoggedInScreen';
import useRootNavigation from '../../useRootNavigation';

export default function RecordAidRequestScreen(): React.ReactElement {
  const rootNavigation = useRootNavigation();
  return (
    <RequireLoggedInScreen>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <RecordAidRequestForm
              pop={() => {
                rootNavigation.canGoBack()
                  ? rootNavigation.goBack()
                  : rootNavigation.replace('Main');
              }}
            />
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

import * as React from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import CreateRequestForm from '../aid_requests/CreateRequestForm';

export default function CreateRequestRootScreen(): JSX.Element {
  const windowWidth = Dimensions.get('window').width;
  const [showCreationToast, setShowCreationToast] =
    React.useState<boolean>(false);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.scrollView}>
          <CreateRequestForm setShowCreationToast={setShowCreationToast} />
        </View>
      </ScrollView>
      <View style={[styles.snackbar, { minWidth: windowWidth - 32 }]}>
        <Snackbar
          onDismiss={() => {
            setShowCreationToast(false);
          }}
          visible={showCreationToast}
        >
          Created Request
        </Snackbar>
      </View>
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
  snackbar: {
    bottom: 0,
    elevation: 1,
    margin: 16,
    position: 'absolute',
  },
});

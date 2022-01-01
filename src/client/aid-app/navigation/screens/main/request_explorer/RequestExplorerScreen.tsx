import * as React from 'react';
import { StyleSheet } from 'react-native';
import View from '../../../../../general-purpose/components/light-or-dark-themed/View';
import ListOfRequests from '../../../../aid_requests/ListOfAidRequests';

export default function RequestExplorerScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <ListOfRequests />
    </View>
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

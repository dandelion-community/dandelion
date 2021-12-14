import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Text from '../../general-purpose/components/light-or-dark-themed/Text';
import View from '../../general-purpose/components/light-or-dark-themed/View';
import Loading from '../../general-purpose/utils/loading';
import { useViewerContext } from '../../general-purpose/viewer/ViewerContext';

export default function ListOfRequests(): JSX.Element {
  const { username } = useViewerContext();
  return (
    <View style={styles.container}>
      {(() => {
        if (username === Loading) {
          return (
            <>
              <Text>Loading viewer</Text>
              <ActivityIndicator />
            </>
          );
        } else if (username === undefined) {
          return <Text>You are't logged in</Text>;
        } else {
          return <Text>You're logged in as {username}</Text>;
        }
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});

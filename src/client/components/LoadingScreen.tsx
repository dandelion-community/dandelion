import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Text from 'src/client/components/Text';
import View from 'src/client/components/ViewWithBackground';
import DebouncedLoadingIndicator from 'src/client/utils/DebouncedLoadingIndicator';

type Props = {
  message?: string;
  progress?: number;
};

export default function LoadingScreen({ message, progress }: Props) {
  const windowWidth = Dimensions.get('window').width;
  return (
    <View style={styles.container}>
      <DebouncedLoadingIndicator />
      {message ? <Text>{message}</Text> : null}
      {progress == null ? null : (
        <View style={{ marginVertical: 20, minWidth: windowWidth * 0.5 }}>
          <ProgressBar progress={progress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

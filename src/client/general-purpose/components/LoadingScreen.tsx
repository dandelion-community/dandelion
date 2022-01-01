import * as React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import DebouncedLoadingIndicator from '../utils/DebouncedLoadingIndicator';
import Text from './light-or-dark-themed/Text';
import View from './light-or-dark-themed/View';

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

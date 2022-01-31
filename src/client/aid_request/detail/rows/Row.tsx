import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactChild;
};

export default function Row({ children }: Props): JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.paddedContents}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  paddedContents: {
    padding: 8,
  },
  row: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
});

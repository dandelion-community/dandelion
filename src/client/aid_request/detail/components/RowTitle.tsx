import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  children: string;
  extraBig?: boolean;
};

export default function Row({ children, extraBig }: Props): JSX.Element {
  const color = useColor('text');
  return (
    <Text
      style={[
        { color },
        styles.rowTitle,
        extraBig ? styles.extraBig : styles.regularSize,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  extraBig: {
    fontSize: 20,
    lineHeight: 24,
  },
  regularSize: {
    fontSize: 14,
    lineHeight: 20,
  },
  rowTitle: {
    fontWeight: '500',
  },
});

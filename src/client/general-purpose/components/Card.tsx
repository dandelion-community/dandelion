import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export default function Card({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <PaperCard elevation={4} style={styles.card}>
      {children}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    margin: 10,
  },
});

import useColorScheme from 'light-or-dark/useColorScheme';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export default function Card({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const theme = useColorScheme();
  return (
    <PaperCard
      elevation={4}
      style={[styles.card, theme === 'light' ? styles.light : styles.dark]}
    >
      {children}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    margin: 10,
  },
  dark: { backgroundColor: '#222' },
  light: {},
});

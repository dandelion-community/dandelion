import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import View from './light-or-dark-themed/View';

type Props = {
  text: string;
  onPress: () => void;
};

export default function AidButton({ text, onPress }: Props) {
  return (
    <View style={styles.container}>
      <PaperButton mode="contained" onPress={onPress}>
        {text}
      </PaperButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

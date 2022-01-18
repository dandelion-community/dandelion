import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import View from './View';

type Props = {
  loading?: boolean;
  text: string;
  onPress: () => void;
};

export default function AidButton({ loading, text, onPress }: Props) {
  return (
    <View style={styles.container}>
      <PaperButton
        compact={true}
        loading={loading ?? false}
        mode="contained"
        onPress={onPress}
      >
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

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import View from './light-or-dark-themed/View';

type Props = {
  autoComplete: 'username' | 'password' | 'off';
  label: string;
  secureTextEntry?: boolean;
  setValue: (value: string) => void;
  value: string;
};

export default function TextInput({
  autoComplete,
  label,
  secureTextEntry,
  setValue,
  value,
}: Props) {
  return (
    <View style={styles.container}>
      <PaperTextInput
        autoComplete={autoComplete}
        label={label}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

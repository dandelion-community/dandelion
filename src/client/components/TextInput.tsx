import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  TextInput as PaperTextInput,
} from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = {
  autoComplete: 'email' | 'password' | 'off';
  autoFocus: boolean;
  label: string;
  mode?: 'outlined' | 'flat';
  secureTextEntry?: boolean;
  setFocused?: (value: boolean) => void;
  setValue: (value: string) => void;
  value: string;
};

const DARK_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
  },
};

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
  },
};

export default function TextInput({
  autoComplete,
  autoFocus,
  label,
  mode,
  secureTextEntry,
  setFocused,
  setValue,
  value,
}: Props) {
  const scheme = useColorScheme();
  return (
    <View>
      <View style={styles.topSpacer} />
      <PaperTextInput
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        label={label}
        mode={mode ?? 'outlined'}
        onBlur={() => setFocused?.(false)}
        onChangeText={setValue}
        onFocus={() => setFocused?.(true)}
        secureTextEntry={secureTextEntry}
        theme={scheme === 'light' ? LIGHT_THEME : DARK_THEME}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topSpacer: {
    height: 10,
  },
});

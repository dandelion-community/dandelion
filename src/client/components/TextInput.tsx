import * as React from 'react';
import { StyleSheet, TextInput as NativeTextInput, View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  TextInput as PaperTextInput,
} from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

export type TextInputHandles = Pick<NativeTextInput, 'focus'>;

type Props = {
  autoComplete: 'email' | 'password' | 'off';
  autoFocus: boolean;
  label: string;
  mode?: 'outlined' | 'flat';
  onSubmitEditing?: (() => void) | undefined;
  returnKeyType?: 'next' | 'go' | 'done' | undefined;
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

const TextInput = React.forwardRef<TextInputHandles, Props>(
  (
    {
      autoComplete,
      autoFocus,
      label,
      mode,
      onSubmitEditing,
      returnKeyType,
      setFocused,
      setValue,
      value,
    }: Props,
    ref,
  ) => {
    const scheme = useColorScheme();
    const isExactInput =
      autoComplete === 'email' || autoComplete === 'password';

    const textInputRef = React.useRef<NativeTextInput | undefined | null>();
    React.useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));
    return (
      <View>
        <View style={styles.topSpacer} />
        <PaperTextInput
          autoCapitalize={isExactInput ? 'none' : 'sentences'}
          autoComplete={autoComplete}
          autoCorrect={!isExactInput}
          autoFocus={autoFocus}
          keyboardType={autoComplete === 'email' ? 'email-address' : 'default'}
          label={label}
          maxLength={1024}
          mode={mode ?? 'outlined'}
          onBlur={() => setFocused?.(false)}
          onChangeText={setValue}
          onFocus={() => setFocused?.(true)}
          onSubmitEditing={onSubmitEditing}
          ref={(ref) => {
            textInputRef.current = ref;
          }}
          returnKeyType={returnKeyType}
          secureTextEntry={autoComplete === 'password'}
          theme={scheme === 'light' ? LIGHT_THEME : DARK_THEME}
          value={value}
        />
      </View>
    );
  },
);

export default TextInput;

const styles = StyleSheet.create({
  topSpacer: {
    height: 10,
  },
});

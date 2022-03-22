import * as React from 'react';
import { StyleSheet, TextInput as NativeTextInput, View } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';

export type TextInputHandles = Pick<NativeTextInput, 'focus'> & {
  setValue: (value: string) => void;
};

type Props = {
  autoComplete: 'email' | 'password' | 'off';
  autoFocus: boolean;
  disabled?: boolean;
  label: string;
  mode?: 'outlined' | 'flat';
  onSubmitEditing?: (() => void) | undefined;
  returnKeyType?: 'next' | 'go' | 'done' | undefined;
  setFocused?: (value: boolean) => void;
  setValue: (value: string) => void;
  value: string;
};

const TextInput = React.forwardRef<TextInputHandles, Props>(
  (
    {
      autoComplete,
      autoFocus,
      disabled,
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
    const isExactInput =
      autoComplete === 'email' || autoComplete === 'password';

    const textInputRef = React.useRef<NativeTextInput | undefined | null>();
    React.useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      setValue: (value: string): void => {
        textInputRef.current?.setNativeProps({ value });
      },
    }));
    return (
      <View>
        <View style={styles.topSpacer} />
        <PaperTextInput
          autoCapitalize={isExactInput ? 'none' : 'sentences'}
          autoComplete={autoComplete}
          autoCorrect={!isExactInput}
          autoFocus={autoFocus}
          disabled={disabled ?? false}
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

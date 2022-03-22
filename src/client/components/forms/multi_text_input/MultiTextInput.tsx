import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import type { TextInputHandles } from './MultiTextInputRow';
import MultiTextInputRow from './MultiTextInputRow';

type Props = {
  value: string[];
  setValue: (updater: (previousValue: string[]) => string[]) => void;
};

export default function MultiTextInput({ value, setValue }: Props) {
  const [inputIsFocused, setInputIsFocused] = React.useState<boolean[]>([]);
  const anyInputIsFocused = inputIsFocused.some(Boolean);
  const scheme = useColorScheme();
  const shouldOutline = anyInputIsFocused || value.filter(Boolean).length > 0;
  const inputs = React.useRef<(TextInputHandles | null)[]>([]);

  // If the user selects the "Add another request"
  // field when the previous text input is still empty,
  // refocus on the previous text input
  React.useEffect(() => {
    const n = value.length + 1;
    if (inputIsFocused[n - 1] && !value[n - 2]) {
      inputs.current[n - 2]?.focus();
    }
  }, [anyInputIsFocused, inputIsFocused, value]);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: !shouldOutline
            ? 'transparent'
            : scheme === 'light'
            ? anyInputIsFocused
              ? 'rgba(165, 119, 231, 0.54)'
              : 'rgba(0,0,0,0.54)'
            : anyInputIsFocused
            ? 'rgba(165, 119, 231, 0.54)'
            : 'rgba(255,255,255,0.54)',
        },
      ]}
    >
      {[...value, undefined].map(
        (elem: string | undefined, index: number): JSX.Element => {
          return (
            <MultiTextInputRow
              isFirst={index === 0} // eslint-disable-next-line react/no-array-index-key
              isLast={index === value.length}
              key={String(index)}
              next={() => {
                inputs.current?.[index + 1]?.focus();
              }}
              ref={(val) => {
                inputs.current[index] = val;
              }}
              removeRow={
                elem === undefined || value.length === 1
                  ? undefined
                  : () => removeRow(index)
              }
              setInputValue={(val) => setValueAtIndex(val, index)}
              setIsFocused={(val) => setInputIsFocusedAtIndex(val, index)}
              value={elem}
            />
          );
        },
      )}
    </View>
  );

  function setInputIsFocusedAtIndex(val: boolean, index: number): void {
    setInputIsFocused((previousValue: boolean[]): boolean[] => {
      const newValue = [...previousValue];
      newValue[index] = val;
      return newValue;
    });
  }

  function setValueAtIndex(val: string, index: number): void {
    setValue((previousValue: string[]): string[] => {
      const newValue = [...previousValue];
      newValue[index] = val;
      return newValue;
    });
  }

  function removeRow(index: number): void {
    setInputIsFocused((previousValue: boolean[]): boolean[] => {
      const newValue = [...previousValue];
      newValue.splice(index, 1);
      return newValue;
    });
    setValue((previousValue: string[]): string[] => {
      const newValue = [...previousValue];
      newValue.splice(index, 1);
      return newValue;
    });
    inputs.current.splice(index, 1);
    inputs.current[
      Math.min(Math.max(index - 1, 0), inputs.current.length - 1)
    ]?.focus();
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
  },
  row: {
    margin: 10,
  },
});

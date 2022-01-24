import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import WhatIsNeededLabel from './WhatIsNeededLabel';
import WhatIsNeededRow, { TextInputHandles } from './WhatIsNeededRow';

type Props = {
  whatIsNeeded: string[];
  scrollToEnd: () => void;
  setWhatIsNeeded: (updater: (previousValue: string[]) => string[]) => void;
};

export default function WhatIsNeeded({
  whatIsNeeded,
  scrollToEnd,
  setWhatIsNeeded,
}: Props): JSX.Element {
  const [inputIsFocused, setInputIsFocused] = React.useState<boolean[]>([]);
  const anyInputIsFocused = inputIsFocused.some(Boolean);
  const scheme = useColorScheme();
  const shouldOutline =
    anyInputIsFocused || whatIsNeeded.filter(Boolean).length > 0;
  const inputs = React.useRef<(TextInputHandles | null)[]>([]);

  // If the user selects the "Add another request"
  // field when the previous text input is still empty,
  // refocus on the previous text input
  React.useEffect(() => {
    const n = whatIsNeeded.length + 1;
    if (inputIsFocused[n - 1] && !whatIsNeeded[n - 2]) {
      inputs.current[n - 2]?.focus();
    }
  }, [anyInputIsFocused, inputIsFocused, whatIsNeeded]);

  return (
    <View>
      <WhatIsNeededLabel show={shouldOutline} />
      <View
        style={[
          styles.container,
          {
            borderColor: !shouldOutline
              ? 'rgba(0,0,0,0)'
              : scheme === 'light'
              ? 'rgba(0,0,0,0.54)'
              : 'rgba(255,255,255,0.54)',
          },
        ]}
      >
        {[...whatIsNeeded, undefined].map(
          (request: string | undefined, index: number): JSX.Element => {
            return (
              <WhatIsNeededRow
                key={String(index)} // eslint-disable-next-line react/no-array-index-key
                next={() => {
                  inputs.current[index + 1]?.focus();
                }}
                ref={(val) => {
                  inputs.current[index] = val;
                }}
                removeRow={
                  request === undefined || whatIsNeeded.length === 1
                    ? undefined
                    : () => removeRow(index)
                }
                request={request}
                setInputValue={(val) => setWhatIsNeededAtIndex(val, index)}
                setIsFocused={(val) => setInputIsFocusedAtIndex(val, index)}
              />
            );
          },
        )}
      </View>
    </View>
  );

  function setInputIsFocusedAtIndex(val: boolean, index: number): void {
    setInputIsFocused((previousValue: boolean[]): boolean[] => {
      const newValue = [...previousValue];
      newValue[index] = val;
      return newValue;
    });
  }

  function setWhatIsNeededAtIndex(val: string, index: number): void {
    setWhatIsNeeded((previousValue: string[]): string[] => {
      const newValue = [...previousValue];
      if (newValue.length === index) {
        // This will trigger a new input field to be added at the
        // end of the list so we should scroll down so the user
        // can see the new input field
        setTimeout(scrollToEnd, 100);
      }
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
    setWhatIsNeeded((previousValue: string[]): string[] => {
      const newValue = [...previousValue];
      newValue.splice(index, 1);
      return newValue;
    });
    inputs.current.splice(index, 1);
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

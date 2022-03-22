import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInputHandles } from 'src/client/aid_request/create/WhatIsNeededRow';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import WhoIsItForLabel from './WhoIsItForLabel';
import WhoIsItForRow from './WhoIsItForRow';

type Props = {
  whoIsItFor: string[];
  setWhoIsItFor: (updater: (previousValue: string[]) => string[]) => void;
};

const MultiWhoIsItForInput = React.forwardRef<TextInputHandles, Props>(
  ({ whoIsItFor, setWhoIsItFor }: Props, ref): JSX.Element => {
    const [inputIsFocused, setInputIsFocused] = React.useState<boolean[]>([]);
    const anyInputIsFocused = inputIsFocused.some(Boolean);
    const scheme = useColorScheme();
    const shouldOutline =
      anyInputIsFocused || whoIsItFor.filter(Boolean).length > 0;
    const inputs = React.useRef<(TextInputHandles | null)[]>([]);
    React.useImperativeHandle(ref, () => ({
      focus: () => inputs.current[0]?.focus(),
    }));

    // If the user selects the "Add another request"
    // field when the previous text input is still empty,
    // refocus on the previous text input
    React.useEffect(() => {
      const n = whoIsItFor.length + 1;
      if (inputIsFocused[n - 1] && !whoIsItFor[n - 2]) {
        inputs.current[n - 2]?.focus();
      }
    }, [anyInputIsFocused, inputIsFocused, whoIsItFor]);

    return (
      <View>
        <WhoIsItForLabel show={shouldOutline} />
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
          {[...whoIsItFor, undefined].map(
            (request: string | undefined, index: number): JSX.Element => {
              return (
                <WhoIsItForRow
                  isFirst={index === 0} // eslint-disable-next-line react/no-array-index-key
                  key={String(index)}
                  next={() => {
                    // setTimeout(() => scrollToEnd(), 100);
                  }}
                  ref={(val) => {
                    inputs.current[index] = val;
                  }}
                  removeRow={
                    request === undefined || whoIsItFor.length === 1
                      ? undefined
                      : () => removeRow(index)
                  }
                  request={request}
                  setInputValue={(val) => setWhoIsItForElement(val, index)}
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

    function setWhoIsItForElement(val: string, index: number): void {
      setWhoIsItFor((previousValue: string[]): string[] => {
        const newValue = [...previousValue];
        if (newValue.length === index) {
          // This will trigger a new input field to be added at the
          // end of the list so we should scroll down so the user
          // can see the new input field
          // setTimeout(scrollToEnd, 100);
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
      setWhoIsItFor((previousValue: string[]): string[] => {
        const newValue = [...previousValue];
        newValue.splice(index, 1);
        return newValue;
      });
      inputs.current.splice(index, 1);
    }
  },
);

export default MultiWhoIsItForInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 1,
  },
  row: {
    margin: 10,
  },
});

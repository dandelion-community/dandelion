import * as React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import Icon from 'src/client/components/Icon';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = {
  next: () => void;
  removeRow: undefined | (() => void);
  request: string | undefined;
  setInputValue: (val: string) => void;
  setIsFocused: (val: boolean) => void;
};

export type TextInputHandles = Pick<TextInput, 'focus'>;

const ICON_SIZE = 24;

const WhatIsNeededRow = React.forwardRef<TextInputHandles, Props>(
  (
    {
      next,
      removeRow,
      request,
      setInputValue,
      setIsFocused: setIsFocusedParent,
    }: Props,
    ref,
  ): JSX.Element => {
    const scheme = useColorScheme();
    const paperTheme = useTheme();
    const [isFocused, setIsFocusedInternal] = React.useState<boolean>(false);
    const textInputRef = React.useRef<TextInput | undefined | null>();
    React.useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));

    return (
      <>
        <View style={styles.row}>
          <Pressable onPress={() => textInputRef.current?.focus()}>
            <View style={styles.icon}>
              <View style={{ opacity: request === undefined ? 0.6 : 0.9 }}>
                <Icon
                  path={request === undefined ? 'plus' : 'flower'}
                  size={ICON_SIZE}
                />
              </View>
            </View>
          </Pressable>
          <View style={styles.textInput}>
            <TextInput
              autoFocus={false}
              onBlur={() => setIsFocused(false)}
              onChangeText={setInputValue}
              onFocus={() => setIsFocused(true)}
              onSubmitEditing={next}
              placeholder={
                request === undefined ? 'Add another request' : 'Add a request'
              }
              ref={(ref) => {
                textInputRef.current = ref;
              }}
              style={[
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore ts thinks outline: 'none' is invalid but it's not
                Platform.OS === 'web' ? { outline: 'none' } : {},
                {
                  color:
                    scheme === 'dark' ? Colors.dark.text : Colors.light.text,
                },
              ]}
              underlineColorAndroid="transparent"
              value={request ?? ''}
            />
          </View>
          <View style={styles.icon}>
            {removeRow === undefined ? null : (
              <Pressable onPress={removeRow}>
                <View style={{ opacity: 0.6 }}>
                  <Icon path="x" size={ICON_SIZE} />
                </View>
              </Pressable>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: isFocused
              ? paperTheme.colors.primary
              : 'transparent',
            height: 2,
            marginBottom: 4,
            marginHorizontal: 8,
            marginTop: 2,
          }}
        />
      </>
    );

    function setIsFocused(val: boolean): void {
      setIsFocusedInternal(val);
      setIsFocusedParent(val);
    }
  },
);

export default WhatIsNeededRow;

const styles = StyleSheet.create({
  icon: {
    flexGrow: 0,
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  textInput: {
    flexGrow: 1,
    marginHorizontal: 8,
  },
});

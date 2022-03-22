import * as React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import Icon from 'src/client/components/Icon';

type Props = {
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  removeRow: undefined | (() => void);
  value: string | undefined;
  setInputValue: (val: string) => void;
  setIsFocused: (val: boolean) => void;
};

export type TextInputHandles = Pick<TextInput, 'focus'>;

const ICON_SIZE = 24;

const MultiTextInputRow = React.forwardRef<TextInputHandles, Props>(
  (
    {
      isFirst,
      isLast,
      next,
      removeRow,
      value,
      setInputValue,
      setIsFocused: setIsFocusedParent,
    }: Props,
    ref,
  ): JSX.Element => {
    const placeholderTextColor = useColor('placeholderText');
    const textColor = useColor('text');
    const paperTheme = useTheme();
    const [isFocused, setIsFocusedInternal] = React.useState<boolean>(false);
    const textInputRef = React.useRef<TextInput | undefined | null>();
    React.useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));
    const canSeeX = removeRow != null && isFocused;

    return (
      <>
        <View style={styles.row}>
          <Pressable onPress={focus}>
            <View style={styles.icon}>
              <View
                style={{
                  opacity: value === undefined ? 0.9 : 0.6,
                }}
              >
                <Icon
                  path={value === undefined ? 'plus' : 'flower'}
                  size={ICON_SIZE}
                />
              </View>
            </View>
          </Pressable>
          <View style={styles.textInput}>
            <TextInput
              autoFocus={isFirst}
              onBlur={() => setIsFocused(false)}
              onChangeText={setInputValue}
              onFocus={() => setIsFocused(true)}
              onSubmitEditing={next}
              placeholder={value === undefined && !isFirst ? 'Add another' : ''}
              placeholderTextColor={placeholderTextColor}
              ref={(ref) => {
                textInputRef.current = ref;
              }}
              returnKeyType="next"
              style={[
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore ts thinks outline: 'none'  is invalid but it's not
                Platform.OS === 'web' ? { outline: 'none' } : {},
                {
                  color: textColor,
                },
              ]}
              underlineColorAndroid="transparent"
              value={value ?? ''}
            />
          </View>
          {isLast ? (
            <TextInput
              key="spacer"
              style={{ height: 1, opacity: 0 }}
              value=""
            />
          ) : null}
          <Pressable onPress={canSeeX ? removeRow : focus}>
            <View style={styles.icon}>
              {!canSeeX ? null : (
                <View style={{ opacity: 0.6 }}>
                  <Icon path="x" size={ICON_SIZE} />
                </View>
              )}
            </View>
          </Pressable>
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
      setTimeout(() => {
        setIsFocusedInternal(val);
        setIsFocusedParent(val);
      }, 0);
    }

    function focus(): void {
      textInputRef.current?.focus();
    }
  },
);

export default MultiTextInputRow;

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
    color: '#ffffff',
    flexGrow: 1,
    marginHorizontal: 8,
  },
});

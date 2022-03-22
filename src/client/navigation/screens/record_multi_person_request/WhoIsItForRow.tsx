import * as React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import Icon from 'src/client/components/Icon';

type Props = {
  isFirst: boolean;
  next: () => void;
  removeRow: undefined | (() => void);
  request: string | undefined;
  setInputValue: (val: string) => void;
  setIsFocused: (val: boolean) => void;
};

export type TextInputHandles = Pick<TextInput, 'focus'>;

const ICON_SIZE = 24;

const WhoIsItForRow = React.forwardRef<TextInputHandles, Props>(
  (
    {
      isFirst,
      next,
      removeRow,
      request,
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
      focus: () => setTimeout(() => textInputRef.current?.focus(), 400),
    }));
    const canSeeX = removeRow != null && isFocused;

    return (
      <>
        <View style={styles.row}>
          <Pressable onPress={focus}>
            <View style={styles.icon}>
              <View
                style={{
                  opacity: request === undefined ? 0.9 : 0.6,
                }}
              >
                <Icon
                  path={request === undefined ? 'plus' : 'flower'}
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
              placeholder={
                request === undefined && !isFirst
                  ? 'Add another person'
                  : 'Add a person'
              }
              placeholderTextColor={placeholderTextColor}
              ref={(ref) => {
                textInputRef.current = ref;
              }}
              style={[
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore ts thinks outline: 'none'  is invalid but it's not
                Platform.OS === 'web' ? { outline: 'none' } : {},
                {
                  color: textColor,
                },
              ]}
              underlineColorAndroid="transparent"
              value={request ?? ''}
            />
          </View>
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

export default WhoIsItForRow;

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

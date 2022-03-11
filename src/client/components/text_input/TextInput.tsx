/* From https://github.com/callstack/react-native-paper/blob/main/src/components/TextInput/TextInput.tsx */

import * as React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  TextInput as NativeTextInput,
  TextStyle,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { Part } from '../mentions/types';
import TextInputAffix, {
  Props as TextInputAffixProps,
} from './Adornment/TextInputAffix';
import TextInputIcon, {
  Props as TextInputIconProps,
} from './Adornment/TextInputIcon';
import TextInputFlat from './TextInputFlat';
import TextInputOutlined from './TextInputOutlined';
import type { RenderProps, TextInputLabelProp } from './types';

const BLUR_ANIMATION_DURATION = 180;
const FOCUS_ANIMATION_DURATION = 150;

export type TextInputProps = React.ComponentPropsWithRef<
  typeof NativeTextInput
> & {
  /**
   * Mode of the TextInput.
   * - `flat` - flat input with an underline.
   * - `outlined` - input with an outline.
   *
   * In `outlined` mode, the background color of the label is derived from `colors.background` in theme or the `backgroundColor` style.
   * This component render TextInputOutlined or TextInputFlat based on that props
   */
  mode?: 'flat' | 'outlined';
  left?: React.ReactNode;
  right?: React.ReactNode;
  /**
   * If true, user won't be able to interact with the component.
   */
  disabled?: boolean;
  /**
   * The text or component to use for the floating label.
   */
  label?: TextInputLabelProp;
  /**
   * Placeholder for the input.
   */
  placeholder?: string;
  /**
   * Whether to style the TextInput with error style.
   */
  error?: boolean;
  /**
   * Callback that is called when the text input's text changes. Changed text is passed as an argument to the callback handler.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChangeText?: Function;
  /**
   * Selection color of the input
   */
  selectionColor?: string;
  /**
   * Inactive underline color of the input.
   */
  underlineColor?: string;
  /**
   * Active underline color of the input.
   */
  activeUnderlineColor?: string;
  /**
   * Inactive outline color of the input.
   */
  outlineColor?: string;
  /**
   * Active outline color of the input.
   */
  activeOutlineColor?: string;
  /**
   * Sets min height with densed layout. For `TextInput` in `flat` mode
   * height is `64dp` or in dense layout - `52dp` with label or `40dp` without label.
   * For `TextInput` in `outlined` mode
   * height is `56dp` or in dense layout - `40dp` regardless of label.
   * When you apply `height` prop in style the `dense` prop affects only `paddingVertical` inside `TextInput`
   */
  dense?: boolean;
  /**
   * Whether the input can have multiple lines.
   */
  multiline?: boolean;
  /**
   * The number of lines to show in the input (Android only).
   */
  numberOfLines?: number;
  /**
   * Callback that is called when the text input is focused.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFocus?: (args: any) => void;
  /**
   * Callback that is called when the text input is blurred.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBlur?: (args: any) => void;
  /**
   *
   * Callback to render a custom input component such as `react-native-text-input-mask`
   * instead of the default `TextInput` component from `react-native`.
   *
   * Example:
   * ```js
   * <TextInput
   *   label="Phone number"
   *   render={props =>
   *     <TextInputMask
   *       {...props}
   *       mask="+[00] [000] [000] [000]"
   *     />
   *   }
   * />
   * ```
   */
  render?: (props: RenderProps) => React.ReactNode;
  /**
   * Value of the text input.
   */
  value?: string;
  /**
   * Pass `fontSize` prop to modify the font size inside `TextInput`.
   * Pass `height` prop to set `TextInput` height. When `height` is passed,
   * `dense` prop will affect only input's `paddingVertical`.
   * Pass `paddingHorizontal` to modify horizontal padding.
   * This can be used to get MD Guidelines v1 TextInput look.
   */
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  parts?: Part[];
};

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<
    TextInputProps & React.RefAttributes<TextInputHandles>
  > {
  Icon: React.FunctionComponent<TextInputIconProps>;
  Affix: React.FunctionComponent<Partial<TextInputAffixProps>>;
}

type TextInputHandles = Pick<
  NativeTextInput,
  'focus' | 'clear' | 'blur' | 'isFocused' | 'setNativeProps'
>;

/**
 * A component to allow users to input text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-flat.focused.png" />
 *     <figcaption>Flat (focused)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-flat.disabled.png" />
 *     <figcaption>Flat (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outlined.focused.png" />
 *     <figcaption>Outlined (focused)</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outlined.disabled.png" />
 *     <figcaption>Outlined (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState("");
 *
 *   return (
 *     <TextInput
 *       label="Email"
 *       value={text}
 *       onChangeText={text => setText(text)}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * @extends TextInput props https://reactnative.dev/docs/textinput#props
 */

const TextInput = React.forwardRef<TextInputHandles, TextInputProps>(
  (
    {
      mode = 'flat',
      dense = false,
      disabled = false,
      error: errorProp = false,
      multiline = false,
      editable = true,
      parts = [],
      render = (props: RenderProps) => <NativeTextInput {...props} />,
      ...rest
    }: TextInputProps,
    ref,
  ) => {
    const validInputValue =
      rest.value !== undefined ? rest.value : rest.defaultValue;

    const { current: labeled } = React.useRef<Animated.Value>(
      new Animated.Value(validInputValue ? 0 : 1),
    );
    const { current: error } = React.useRef<Animated.Value>(
      new Animated.Value(errorProp ? 1 : 0),
    );
    const [focused, setFocused] = React.useState<boolean>(false);
    const [placeholder, setPlaceholder] = React.useState<string | undefined>(
      '',
    );
    const [value, setValue] = React.useState<string | undefined>(
      validInputValue,
    );
    const [labelLayout, setLabelLayout] = React.useState<{
      measured: boolean;
      width: number;
      height: number;
    }>({
      height: 0,
      measured: false,
      width: 0,
    });
    const [leftLayout, setLeftLayout] = React.useState<{
      height: number | null;
      width: number | null;
    }>({
      height: null,
      width: null,
    });
    const [rightLayout, setRightLayout] = React.useState<{
      height: number | null;
      width: number | null;
    }>({
      height: null,
      width: null,
    });

    const timer = React.useRef<NodeJS.Timeout | undefined>();

    const root = React.useRef<NativeTextInput | undefined | null>();

    const { scale } = rest.theme.animation;

    React.useImperativeHandle(ref, () => ({
      blur: () => root.current?.blur(),
      clear: () => root.current?.clear(),
      focus: () => root.current?.focus(),
      forceFocus: () => root.current?.focus(),
      isFocused: () => root.current?.isFocused() || false,
      setNativeProps: (args: Record<string, unknown>) =>
        root.current?.setNativeProps(args),
    }));

    React.useLayoutEffect(() => {
      if (typeof rest.value !== 'undefined') setValue(rest.value);
    }, [rest.value]);

    React.useEffect(() => {
      // When the input has an error, we wiggle the label and apply error styles
      if (errorProp) {
        // show error
        Animated.timing(error, {
          duration: FOCUS_ANIMATION_DURATION * scale,
          toValue: 1,
          // To prevent this - https://github.com/callstack/react-native-paper/issues/941
          useNativeDriver: true,
        }).start();
      } else {
        // hide error
        {
          Animated.timing(error, {
            duration: BLUR_ANIMATION_DURATION * scale,
            toValue: 0,
            // To prevent this - https://github.com/callstack/react-native-paper/issues/941
            useNativeDriver: true,
          }).start();
        }
      }
    }, [errorProp, scale, error]);

    React.useEffect(() => {
      // Show placeholder text only if the input is focused, or there's no label
      // We don't show placeholder if there's a label because the label acts as placeholder
      // When focused, the label moves up, so we can show a placeholder
      if (focused || !rest.label) {
        // Set the placeholder in a delay to offset the label animation
        // If we show it immediately, they'll overlap and look ugly
        timer.current = setTimeout(
          () => setPlaceholder(rest.placeholder),
          50,
        ) as unknown as NodeJS.Timeout;
      } else {
        // hidePlaceholder
        setPlaceholder('');
      }

      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    }, [focused, rest.label, rest.placeholder]);

    React.useEffect(() => {
      // The label should be minimized if the text input is focused, or has text
      // In minimized mode, the label moves up and becomes small
      // workaround for animated regression for react native > 0.61
      // https://github.com/callstack/react-native-paper/pull/1440
      if (value || focused) {
        // minimize label
        Animated.timing(labeled, {
          duration: BLUR_ANIMATION_DURATION * scale,
          toValue: 0,
          // To prevent this - https://github.com/callstack/react-native-paper/issues/941
          useNativeDriver: true,
        }).start();
      } else {
        // restore label
        {
          Animated.timing(labeled, {
            duration: FOCUS_ANIMATION_DURATION * scale,
            toValue: 1,
            // To prevent this - https://github.com/callstack/react-native-paper/issues/941
            useNativeDriver: true,
          }).start();
        }
      }
    }, [focused, value, labeled, scale]);

    const onLeftAffixLayoutChange = (event: LayoutChangeEvent) => {
      setLeftLayout({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      });
    };

    const onRightAffixLayoutChange = (event: LayoutChangeEvent) => {
      setRightLayout({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFocus = (args: any) => {
      if (disabled || !editable) {
        return;
      }

      setFocused(true);

      rest.onFocus?.(args);
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleBlur = (args: Object) => {
      if (!editable) {
        return;
      }

      setFocused(false);
      rest.onBlur?.(args);
    };

    const handleChangeText = (value: string) => {
      if (!editable || disabled) {
        return;
      }

      setValue(value);
      rest.onChangeText?.(value);
    };

    const handleLayoutAnimatedText = (e: LayoutChangeEvent) => {
      setLabelLayout({
        height: e.nativeEvent.layout.height,
        measured: true,
        width: e.nativeEvent.layout.width,
      });
    };
    const forceFocus = () => root.current?.focus();

    if (mode === 'outlined') {
      return (
        <TextInputOutlined
          dense={dense}
          disabled={disabled}
          editable={editable}
          error={errorProp}
          multiline={multiline}
          render={render}
          {...rest}
          forceFocus={forceFocus}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          innerRef={(ref) => {
            root.current = ref;
          }}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onLayoutAnimatedText={handleLayoutAnimatedText}
          onLeftAffixLayoutChange={onLeftAffixLayoutChange}
          onRightAffixLayoutChange={onRightAffixLayoutChange}
          parentState={{
            error,
            focused,
            labelLayout,
            labeled,
            leftLayout,
            placeholder,
            rightLayout,
            value,
          }}
          parts={parts}
          value={value}
        />
      );
    }

    return (
      <TextInputFlat
        dense={dense}
        disabled={disabled}
        editable={editable}
        error={errorProp}
        multiline={multiline}
        render={render}
        {...rest}
        forceFocus={forceFocus}
        innerRef={(ref) => {
          root.current = ref;
        }}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onLayoutAnimatedText={handleLayoutAnimatedText}
        onLeftAffixLayoutChange={onLeftAffixLayoutChange}
        onRightAffixLayoutChange={onRightAffixLayoutChange}
        parentState={{
          error,
          focused,
          labelLayout,
          labeled,
          leftLayout,
          placeholder,
          rightLayout,
          value,
        }}
        value={value}
      />
    );
  },
) as CompoundedComponent;
// @component ./Adornment/TextInputIcon.tsx
TextInput.Icon = TextInputIcon;

// @component ./Adornment/TextInputAffix.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Types of property 'theme' are incompatible.
TextInput.Affix = TextInputAffix;

export default withTheme(TextInput);

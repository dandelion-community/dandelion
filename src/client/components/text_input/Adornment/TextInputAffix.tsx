/* From https://github.com/callstack/react-native-paper/blob/main/src/components/TextInput/Adornment/TextInputAffix.tsx */

import React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import color from 'src/client/utils/color';
import { AdornmentSide } from './enums';

const AFFIX_OFFSET = 12;

export type Props = {
  /**
   * Text to show.
   */
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  /**
   * Style that is passed to the Text element.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type ContextState = {
  topPosition: number | null;
  onLayout?: (event: LayoutChangeEvent) => void;
  visible?: Animated.Value;
  textStyle?: StyleProp<TextStyle>;
  side: AdornmentSide;
  paddingHorizontal?: number | string;
};

const AffixContext = React.createContext<ContextState>({
  side: AdornmentSide.Left,
  textStyle: { color: '', fontFamily: '' },
  topPosition: null,
});

const AffixAdornment: React.FunctionComponent<
  {
    affix: React.ReactNode;
    testID: string;
  } & ContextState
> = ({
  affix,
  side,
  textStyle,
  topPosition,
  onLayout,
  visible,
  paddingHorizontal,
}) => {
  return (
    <AffixContext.Provider
      value={{
        onLayout,
        paddingHorizontal,
        side,
        textStyle,
        topPosition,
        visible,
      }}
    >
      {affix}
    </AffixContext.Provider>
  );
};

/**
 * A component to render a leading / trailing text in the TextInput
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/textinput-outline.affix.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *   return (
 *     <TextInput
 *       mode="outlined"
 *       label="Outlined input"
 *       placeholder="Type something"
 *       right={<TextInput.Affix text="/100" />}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */

const TextInputAffix = ({ text, textStyle: labelStyle, theme }: Props) => {
  const { textStyle, onLayout, topPosition, side, visible, paddingHorizontal } =
    React.useContext(AffixContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textColor = (color(theme.colors.text) as any)
    .alpha(theme.dark ? 0.7 : 0.54)
    .rgb()
    .string();

  const offset =
    typeof paddingHorizontal === 'number' ? paddingHorizontal : AFFIX_OFFSET;

  const style = {
    [side]: offset,
    top: topPosition,
  } as ViewStyle;

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        styles.container,
        style,
        {
          opacity:
            visible?.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }) || 1,
        },
      ]}
    >
      <Text style={[{ color: textColor }, textStyle, labelStyle]}>{text}</Text>
    </Animated.View>
  );
};
TextInputAffix.displayName = 'TextInput.Affix';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});

export default withTheme(TextInputAffix);

// @component-docs ignore-next-line
export { TextInputAffix, AffixAdornment };

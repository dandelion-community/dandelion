import * as React from 'react';
import {
  Animated,
  I18nManager,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { withTheme } from 'react-native-paper';

type Props = React.ComponentPropsWithRef<typeof Animated.Text> & {
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * Text component which follows styles from the theme.
 *
 * @extends Text props https://reactnative.dev/docs/text#props
 */
function AnimatedText({ style, theme, ...rest }: Props) {
  const writingDirection = I18nManager.isRTL ? 'rtl' : 'ltr';

  return (
    <Animated.Text
      {...rest}
      style={[
        styles.text,
        {
          ...theme.fonts.regular,
          color: theme.colors.text,
          writingDirection,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default withTheme(AnimatedText);

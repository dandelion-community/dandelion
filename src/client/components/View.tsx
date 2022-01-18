/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { View as ReactNativeView } from 'react-native';
import type { ThemeProps } from 'src/client/light-or-dark/ThemePropsType';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';

export type ViewProps = ThemeProps & ReactNativeView['props'];

export default function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { dark: darkColor, light: lightColor },
    'background',
  );

  return (
    <ReactNativeView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

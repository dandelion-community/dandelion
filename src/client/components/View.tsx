/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import type { ThemeProps } from 'light-or-dark/ThemePropsType';
import { useThemeColor } from 'light-or-dark/useThemeColor';
import * as React from 'react';
import { View as ReactNativeView } from 'react-native';

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

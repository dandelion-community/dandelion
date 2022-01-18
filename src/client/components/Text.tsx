/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import type { ThemeProps } from 'light-or-dark/ThemePropsType';
import { useThemeColor } from 'light-or-dark/useThemeColor';
import * as React from 'react';
import { Text as ReactNativeText } from 'react-native';

export type TextProps = ThemeProps & ReactNativeText['props'];

export default function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ dark: darkColor, light: lightColor }, 'text');

  return <ReactNativeText style={[{ color }, style]} {...otherProps} />;
}

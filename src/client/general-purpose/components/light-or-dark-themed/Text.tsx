/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text as ReactNativeText } from 'react-native';
import type { ThemeProps } from './ThemePropsType';
import { useThemeColor } from './useThemeColor';

export type TextProps = ThemeProps & ReactNativeText['props'];

export default function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ dark: darkColor, light: lightColor }, 'text');

  return <ReactNativeText style={[{ color }, style]} {...otherProps} />;
}

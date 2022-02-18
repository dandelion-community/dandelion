/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { Text as ReactNativeText } from 'react-native';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';

export type TextProps = ReactNativeText['props'];

export default function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = useThemeColor({ dark: undefined, light: undefined }, 'text');

  return <ReactNativeText style={[{ color }, style]} {...otherProps} />;
}

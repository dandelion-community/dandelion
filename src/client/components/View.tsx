/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import { View as ReactNativeView } from 'react-native';
import { useThemeColor } from 'src/client/light-or-dark/useThemeColor';

export type ViewProps = ReactNativeView['props'];

export default function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { dark: undefined, light: undefined },
    'background',
  );

  return (
    <ReactNativeView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

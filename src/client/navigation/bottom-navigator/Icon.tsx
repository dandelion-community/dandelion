/**
 * This file is copied from react-native-paper
 * https://github.com/callstack/react-native-paper/blob/main/src/components/Icon.tsx
 * 
 * I know forking is a thing but I don't really know how to do it and don't want to slow myself down by learning :p
 * 
 * react-native-paper's license is as follows:
 * 
MIT License
Copyright (c) 2017 Callstack
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

import * as React from 'react';
import {
  I18nManager,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const accessibilityProps =
  Platform.OS === 'web'
    ? {
        focusable: false,
        role: 'img',
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants' as const,
      };

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

type Props = IconProps & {
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string') ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' ||
  // image url on web
  (Platform.OS === 'web' &&
    typeof source === 'string' &&
    (source.startsWith('data:image') ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIconId = (source: any) => {
  if (
    typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string'
  ) {
    return source.uri;
  }

  return source;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidIcon = (source: any) =>
  typeof source === 'string' ||
  typeof source === 'function' ||
  isImageSource(source);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

const Icon = ({ source, color, size, theme, ...rest }: Props) => {
  const direction =
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;
  const s =
    typeof source === 'object' && source.direction && source.source
      ? source.source
      : source;
  const iconColor = color || theme.colors.text;

  if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          {
            height: size,
            resizeMode: 'contain',
            tintColor: color,
            width: size,
          },
        ]}
        {...accessibilityProps}
      />
    );
  } else if (typeof s === 'string') {
    return <MaterialCommunityIcons color={iconColor} name={s} size={size} />;
  } else if (typeof s === 'function') {
    return s({ color: iconColor, direction, size });
  }

  return null;
};

export default withTheme(Icon);

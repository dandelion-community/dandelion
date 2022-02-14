/**
 * This file is copied from react-native-paper
 * https://github.com/callstack/react-native-paper/blob/main/src/utils/useIsKeyboardShown.tsx
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
  Keyboard,
  NativeEventSubscription,
  Platform,
  useWindowDimensions,
} from 'react-native';

type Props = {
  onShow: () => void;
  onHide: () => void;
};
export default function useIsKeyboardShown({ onShow, onHide }: Props) {
  /* // {MODIFIED} */
  const { height, width } = useWindowDimensions();
  const prevHeight = React.useRef<number>(height);
  const prevWidth = React.useRef<number>(width);

  React.useEffect(() => {
    const heightDiff = height - prevHeight.current;
    const widthDiff = width - prevWidth.current;
    if (widthDiff === 0) {
      if (heightDiff < 0) {
        onShow();
      } else if (heightDiff > 0) {
        onHide();
      }
    }
    prevHeight.current = height;
    prevWidth.current = width;
  }, [height, width]);
  /* // {END MODIFIED} */

  React.useEffect(() => {
    let willShowSubscription: NativeEventSubscription | undefined;
    let willHideSubscription: NativeEventSubscription | undefined;
    let didShowSubscription: NativeEventSubscription | undefined;
    let didHideSubscription: NativeEventSubscription | undefined;

    if (Platform.OS === 'ios') {
      willShowSubscription = Keyboard.addListener('keyboardWillShow', onShow);
      willHideSubscription = Keyboard.addListener('keyboardWillHide', onHide);
    } else {
      didShowSubscription = Keyboard.addListener('keyboardDidShow', onShow);
      didHideSubscription = Keyboard.addListener('keyboardDidHide', onHide);
    }

    return () => {
      if (Platform.OS === 'ios') {
        if (willShowSubscription?.remove) {
          willShowSubscription.remove();
        } else {
          Keyboard.removeListener('keyboardWillShow', onShow);
        }

        if (willHideSubscription?.remove) {
          willHideSubscription.remove();
        } else {
          Keyboard.removeListener('keyboardWillHide', onHide);
        }
      } else {
        if (didShowSubscription?.remove) {
          didShowSubscription.remove();
        } else {
          Keyboard.removeListener('keyboardDidShow', onShow);
        }

        if (didHideSubscription?.remove) {
          didHideSubscription.remove();
        } else {
          Keyboard.removeListener('keyboardDidHide', onHide);
        }
      }
    };
  }, [onHide, onShow]);
}

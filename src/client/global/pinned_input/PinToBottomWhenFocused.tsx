import * as React from 'react';
import { View } from 'react-native';
import PinnedInputStore from './PinnedInputStore';

type Props = {
  children: React.ReactElement;
  focus: () => void;
  isFocused: boolean;
};

export default function PinToBottomWhenFocused({
  children,
  focus,
  isFocused,
}: Props): JSX.Element {
  React.useEffect(() => {
    console.log('setState - ', isFocused);
    PinnedInputStore.update({
      render: isFocused || [1].includes(1) ? () => children : undefined,
    });
    if (isFocused) {
      console.log('gonna focus');
      setTimeout(() => {
        console.log('focusing');
        focus();
      }, 100);
    }
  }, [isFocused, focus]);
  return isFocused ? <View /> : children;
}

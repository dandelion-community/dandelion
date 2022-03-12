import * as React from 'react';
import { View } from 'react-native';
import PinnedInputStore from './PinnedInputStore';

type Props = {
  children: React.ReactElement;
  isFocused: boolean;
};

export default function PinToBottomWhenFocused({
  children,
  isFocused,
}: Props): JSX.Element {
  React.useEffect(() => {
    PinnedInputStore.update({
      render: isFocused ? () => children : undefined,
    });
  }, [children, isFocused]);
  return isFocused ? <View /> : children;
}

import * as React from 'react';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'src/client/components/Icon';

type Props = {
  send: () => void;
  hasContents: boolean;
  startEditing: () => void;
  isSending: boolean;
};

export default function SendButton({
  send,
  hasContents,
  startEditing,
  isSending,
}: Props): JSX.Element {
  return (
    <TouchableRipple disabled={isSending} onPress={onPress}>
      <Icon path="send" size={24} />
    </TouchableRipple>
  );

  function onPress(): void {
    if (hasContents) {
      send();
    } else {
      startEditing();
    }
  }
}

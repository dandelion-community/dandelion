import * as React from 'react';
import { Pressable } from 'react-native';
import Icon from 'src/client/components/Icon';
import useDrawerContext from 'src/client/drawer/useDrawerContext';

type Props = {
  iconSize: 24 | 32;
  renderDrawerContents: () => React.ReactElement;
};

export default function DrawerButton({
  iconSize,
  renderDrawerContents,
}: Props): JSX.Element {
  const { openDrawer } = useDrawerContext();
  return (
    <Pressable onPress={() => openDrawer(renderDrawerContents)}>
      <Icon path="kebab" size={iconSize} />
    </Pressable>
  );
}

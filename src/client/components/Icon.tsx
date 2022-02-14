import * as React from 'react';
import { Image, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import getURL from 'src/client/host/host';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = {
  scheme?: 'light' | 'dark';
  onPress?: () => void;
  path: string | undefined | null;
  size?: number;
};

export default function Icon({
  scheme: schemeProp,
  onPress,
  path,
  size = 30,
}: Props): JSX.Element {
  const scheme_ = useColorScheme();
  const scheme = schemeProp ?? scheme_;
  const style = { height: size, width: size };
  const view = (
    <View style={style}>
      {path == null ? null : (
        <Image
          source={{ uri: getURL(`icons/${scheme}/${path}.png`) }}
          style={style}
        />
      )}
    </View>
  );
  return onPress == null ? (
    view
  ) : (
    <TouchableRipple onPress={onPress}>{view}</TouchableRipple>
  );
}

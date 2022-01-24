import * as React from 'react';
import { Image, View } from 'react-native';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';

type Props = {
  path: string | undefined;
  size?: number;
};

export default function Icon({ path, size = 30 }: Props): JSX.Element {
  const scheme = useColorScheme();
  const style = { height: size, width: size };
  return (
    <View style={style}>
      {path == null ? null : (
        <Image source={{ uri: `/icons/${scheme}/${path}.png` }} style={style} />
      )}
    </View>
  );
}

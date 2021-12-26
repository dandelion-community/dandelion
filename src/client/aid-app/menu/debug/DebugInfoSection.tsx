import * as React from 'react';
import { View } from 'react-native';
import PressableText from '../../../general-purpose/components/light-or-dark-themed/PressableText';
import SmallText from './SmallText';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function NetworkDebugInfo({
  children,
  title,
}: Props): JSX.Element {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <>
      <SmallText>
        <PressableText onPress={() => setShow((show) => !show)}>
          {show ? '[-] ' : '[+] '}
        </PressableText>
        {title}
      </SmallText>
      {show ? (
        <View style={{ marginLeft: 4 }}>
          <View style={{ borderColor: '#777', borderWidth: 1 }}>
            <View style={{ margin: 4 }}>{children}</View>
          </View>
        </View>
      ) : null}
    </>
  );
}

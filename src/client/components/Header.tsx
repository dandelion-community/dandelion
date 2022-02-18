import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { useColor } from 'src/client/components/Colors';
import useViewWidth from 'src/client/components/useViewWidth';

type Props = {
  children: React.ReactElement | React.ReactElement[];
};

export default function Header({ children }: Props): JSX.Element {
  const viewWidth = useViewWidth();
  const borderBottomColor = useColor('divider');
  const backgroundColor = useColor('background');

  return (
    <Appbar.Header
      style={{
        alignSelf: 'center',
        backgroundColor,
        borderBottomColor,
        borderBottomWidth: 1,
        elevation: 0,
        width: viewWidth,
      }}
    >
      {children}
    </Appbar.Header>
  );
}

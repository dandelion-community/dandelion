import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import useViewWidth from 'src/client/components/useViewWidth';
import View from 'src/client/components/ViewWithBackground';

type Props = {
  children: React.ReactChild[] | React.ReactChild | React.ReactElement | null;
};

export default function CenteredOnScreen({ children }: Props): JSX.Element {
  const viewWidth = useViewWidth();
  const { width: screenWidth } = useWindowDimensions();

  return (
    <View style={{ alignItems: 'center', width: screenWidth }}>
      <View style={{ width: viewWidth }}>{children}</View>
    </View>
  );
}

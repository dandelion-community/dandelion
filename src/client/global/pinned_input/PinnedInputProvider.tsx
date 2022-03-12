import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import useViewWidth from 'src/client/components/useViewWidth';
import ViewWithBackground from 'src/client/components/ViewWithBackground';
import useStore from 'src/client/store/useStore';
import PinnedInputStore from './PinnedInputStore';

type Props = {
  children: React.ReactChild;
};

export default function PinnedInputProvider({
  children,
}: Props): React.ReactElement {
  const viewWidth = useViewWidth();
  const { width: screenWidth } = useWindowDimensions();
  const { render } = useStore(PinnedInputStore);

  return (
    <>
      {children}
      <View style={[styles.pinnedInput, { width: screenWidth }]}>
        <ViewWithBackground style={{ width: viewWidth }}>
          {render?.()}
        </ViewWithBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  pinnedInput: {
    alignItems: 'center',
    bottom: 0,
    position: 'absolute',
  },
});

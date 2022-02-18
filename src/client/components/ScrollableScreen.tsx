import * as React from 'react';
import { StyleSheet } from 'react-native';
import StaticScrollableList from 'src/client/components/StaticScrollableList';
import useViewWidth from 'src/client/components/useViewWidth';
import View from 'src/client/components/View';

export default function ScrollableScreen({
  children,
}: {
  children: (React.ReactElement | null)[] | React.ReactElement;
}): JSX.Element {
  const viewWidth = useViewWidth();
  return (
    <View style={styles.container}>
      <StaticScrollableList>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: viewWidth }}>{children}</View>
        </View>
      </StaticScrollableList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
});

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColor } from 'src/client/components/Colors';
import Divider from 'src/client/components/Divider';
import Monogram from 'src/client/components/Monogram';

type Props = {
  children: React.ReactChild | React.ReactChild[];
  divider?: boolean;
  header?: string;
  headerMonograms?: string[];
};

export default function Row({
  children,
  divider,
  header,
  headerMonograms,
}: Props): JSX.Element {
  const color = useColor('text');
  return (
    <View style={styles.row}>
      <View style={styles.paddedContents}>
        {header == null ? null : (
          <View style={styles.header}>
            <Text style={[{ color }, styles.headline]}>{header} </Text>
            {(headerMonograms ?? []).map((name: string): React.ReactElement => {
              return <Monogram key={name} name={name} />;
            })}
          </View>
        )}
        {children}
      </View>
      {!divider ? null : <Divider />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  headline: {
    fontSize: 12,
    opacity: 0.6,
  },
  paddedContents: {
    padding: 8,
  },
  row: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
});

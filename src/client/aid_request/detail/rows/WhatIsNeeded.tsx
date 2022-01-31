import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';
import Row from '../components/Row';

type Props = {
  whatIsNeeded: string;
};

export default function WhatIsNeeded({ whatIsNeeded }: Props): JSX.Element {
  const color = useColor('text');
  return (
    <Row>
      <Text style={[styles.whatIsNeeded, { color }]}>{whatIsNeeded}</Text>
    </Row>
  );
}

const styles = StyleSheet.create({
  whatIsNeeded: {
    fontSize: 20,
    lineHeight: 24,
  },
});

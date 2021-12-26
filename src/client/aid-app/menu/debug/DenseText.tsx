import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

type Props = {
  children: string;
};

export default function DenseText({ children }: Props): JSX.Element {
  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', maxHeight: 46 }}>
      <ScrollView>
        <Paragraph
          allowFontScaling={false}
          style={{ fontSize: 8, lineHeight: 10 }}
        >
          {children}
        </Paragraph>
      </ScrollView>
    </View>
  );
}

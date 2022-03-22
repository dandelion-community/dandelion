import * as React from 'react';
import { ScrollView, View } from 'react-native';
import Text from 'src/client/components/Text';

type Props = {
  children: React.ReactChild[] | React.ReactChild;
  errorMessage?: string | undefined;
  title: string;
};

export default function FullScreenFormPageWithBigTitle({
  children,
  errorMessage,
  title,
}: Props) {
  return (
    <ScrollView
      style={{
        flexDirection: 'column-reverse',
        marginBottom: 8,
        marginHorizontal: 8,
      }}
    >
      <View style={{ marginBottom: 64, marginHorizontal: 32 }}>
        <Text style={{ fontSize: 48, fontWeight: '700' }}>{title}</Text>
        <Text>{errorMessage}</Text>
      </View>
      <View style={{ marginHorizontal: 16 }}>{children}</View>
    </ScrollView>
  );
}

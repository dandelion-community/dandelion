import * as React from 'react';
import { Linking, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  slug: string;
  subject: string;
};

const DOMAIN = 'dandelion.supplies';

export default function EmailLink({ slug, subject }: Props): JSX.Element {
  const linkColor = useColor('accent');
  const address = `${slug}@${DOMAIN}`;
  return (
    <Text
      onPress={() => Linking.openURL(`mailto:${address}?subject=${subject}`)}
      style={{ color: linkColor }}
    >
      {address}
    </Text>
  );
}

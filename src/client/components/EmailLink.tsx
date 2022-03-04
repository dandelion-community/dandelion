import * as React from 'react';
import { Linking, Text } from 'react-native';
import { useColor } from 'src/client/components/Colors';
import type { Props } from 'src/client/email_link/createEmailLink';
import createEmailLink from 'src/client/email_link/createEmailLink';
import getEmailAddress from 'src/shared/urls/getEmailAddress';

export default function EmailLink(props: Props): JSX.Element {
  const linkColor = useColor('accent');
  return (
    <Text
      onPress={() => Linking.openURL(createEmailLink(props))}
      style={{ color: linkColor }}
    >
      {getEmailAddress(props)}
    </Text>
  );
}

import * as React from 'react';
import { Paragraph } from 'react-native-paper';

type Props = {
  children: React.ReactNode;
};

export default function SmallText({ children }: Props): JSX.Element {
  return (
    <Paragraph
      allowFontScaling={false}
      style={{ fontSize: 10, lineHeight: 12 }}
    >
      {children}
    </Paragraph>
  );
}

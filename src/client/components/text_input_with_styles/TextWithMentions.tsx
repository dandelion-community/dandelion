import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MentionPartType from 'src/shared/utils/MentionPartType';
import TextWithStyles from 'src/client/components/text_input_with_styles/TextWithStyles';

type Props = {
  value: string;
  style: StyleProp<TextStyle>;
};

export default function TextWithMentions({ style, value }: Props): JSX.Element {
  return (
    <TextWithStyles
      autolink={true}
      partTypes={[MentionPartType]}
      style={style}
      value={value}
    />
  );
}

import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import Autolink from 'react-native-autolink';
import {
  MentionData,
  Part,
  PartType,
} from 'src/shared/utils/types';
import { parseValue } from 'src/shared/utils/mention_utils';

type Props = {
  autolink?: boolean;
  partTypes: PartType[];
  style: StyleProp<TextStyle>;
  value: string;
};

export default function TextWithStyles({
  autolink = false,
  partTypes,
  value,
  style,
}: Props): JSX.Element {
  const { parts } = parseValue(value ?? '', partTypes);
  return <Text style={style}>{parts.map(renderPart)}</Text>;

  function renderPart(
    { text, partType, data }: Part,
    index: number,
  ): React.ReactNode {
    return partType
      ? renderText({
          key: getKeyForPart(text, index, data),
          style: partType.textStyle,
          text,
        })
      : renderText({ key: getKeyForRawText(text, index), text });
  }

  function renderText({
    key,
    style,
    text,
  }: {
    key: string;
    style?: StyleProp<TextStyle>;
    text: string;
  }): JSX.Element {
    if (autolink) {
      return (
        <Autolink
          email={true}
          key={key}
          linkStyle={{ color: '#8888ff' }}
          phone="sms"
          style={style}
          text={text}
          url={true}
        />
      );
    }
    return (
      <Text key={key} style={style}>
        {text}
      </Text>
    );
  }

  function getKeyForRawText(text: string, index: number): string {
    return `${text}-${index}`;
  }

  function getKeyForPart(
    text: string,
    index: number,
    data: MentionData | undefined,
  ): string {
    return `${text}-${index}-${data?.trigger ?? 'pattern'}`;
  }
}

import SmallText from 'menu/debug/SmallText';
import * as React from 'react';

type Props = { error: Error };

export default function GraphQLErrorSummary({ error }: Props): JSX.Element {
  return <SmallText>{error.message}</SmallText>;
}

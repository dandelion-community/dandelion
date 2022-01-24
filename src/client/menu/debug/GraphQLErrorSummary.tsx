import * as React from 'react';
import SmallText from 'src/client/menu/debug/SmallText';

type Props = { error: Error };

export default function GraphQLErrorSummary({ error }: Props): JSX.Element {
  return <SmallText>{error.message}</SmallText>;
}

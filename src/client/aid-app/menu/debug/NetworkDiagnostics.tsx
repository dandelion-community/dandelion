import * as React from 'react';
import GraphQLClientURI from '../../graphql/GraphQLClientURI';
import GraphQLHostDiagnostics from './GraphQLHostDiagnostics';
import SmallText from './SmallText';

export default function NetworkDebugInfo(): JSX.Element {
  return (
    <>
      <SmallText>Expected Host</SmallText>
      <GraphQLHostDiagnostics host={GraphQLClientURI} />
    </>
  );
}

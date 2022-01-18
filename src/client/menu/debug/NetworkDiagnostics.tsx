import GraphQLClientURI from 'graphql/GraphQLClientURI';
import GraphQLHostDiagnostics from 'menu/debug/GraphQLHostDiagnostics';
import SmallText from 'menu/debug/SmallText';
import * as React from 'react';

export default function NetworkDebugInfo(): JSX.Element {
  return (
    <>
      <SmallText>Expected Host</SmallText>
      <GraphQLHostDiagnostics host={GraphQLClientURI} />
    </>
  );
}

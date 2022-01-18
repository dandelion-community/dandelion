import * as React from 'react';
import GraphQLClientURI from 'src/client/graphql/GraphQLClientURI';
import GraphQLHostDiagnostics from 'src/client/menu/debug/GraphQLHostDiagnostics';
import SmallText from 'src/client/menu/debug/SmallText';

export default function NetworkDebugInfo(): JSX.Element {
  return (
    <>
      <SmallText>Expected Host</SmallText>
      <GraphQLHostDiagnostics host={GraphQLClientURI} />
    </>
  );
}

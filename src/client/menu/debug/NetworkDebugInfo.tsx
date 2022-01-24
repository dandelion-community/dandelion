import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import DebugInfoSection from 'src/client/menu/debug/DebugInfoSection';
import NetworkDiagnostics from 'src/client/menu/debug/NetworkDiagnostics';

const SPOT_CHECK_ME_QUERY = gql`
  query SpotCheckMeQuery {
    me {
      username
    }
  }
`;

export default function NetworkDebugInfo(): JSX.Element {
  const { data, error, loading } = useQuery<unknown>(SPOT_CHECK_ME_QUERY);

  const overview = loading ? 'Loading...' : error || !data ? 'Error' : 'Good';

  return (
    <DebugInfoSection title={`Network: ${overview}`}>
      <NetworkDiagnostics />
    </DebugInfoSection>
  );
}

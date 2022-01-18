import * as React from 'react';
import ExpoConstantsSummary from 'src/client/menu/debug/ExpoConstantsSummary';
import NetworkDebugInfo from 'src/client/menu/debug/NetworkDebugInfo';

export default function DebugInfo(): JSX.Element {
  return (
    <>
      <NetworkDebugInfo />
      <ExpoConstantsSummary />
    </>
  );
}

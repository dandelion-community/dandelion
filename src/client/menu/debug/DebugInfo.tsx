import ExpoConstantsSummary from 'menu/debug/ExpoConstantsSummary';
import NetworkDebugInfo from 'menu/debug/NetworkDebugInfo';
import * as React from 'react';

export default function DebugInfo(): JSX.Element {
  return (
    <>
      <NetworkDebugInfo />
      <ExpoConstantsSummary />
    </>
  );
}

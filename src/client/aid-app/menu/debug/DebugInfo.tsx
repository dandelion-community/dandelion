import * as React from 'react';
import ExpoConstantsSummary from './ExpoConstantsSummary';
import NetworkDebugInfo from './NetworkDebugInfo';

export default function DebugInfo(): JSX.Element {
  return (
    <>
      <NetworkDebugInfo />
      <ExpoConstantsSummary />
    </>
  );
}

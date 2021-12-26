import Constants from 'expo-constants';
import {
  brand,
  designName,
  deviceName,
  deviceYearClass,
  isDevice,
  manufacturer,
  modelId,
  osBuildFingerprint,
  osBuildId,
  osInternalBuildId,
  osName,
  osVersion,
  platformApiLevel,
  productName,
  supportedCpuArchitectures,
  totalMemory,
} from 'expo-device';
import * as React from 'react';
import DebugInfoSection from './DebugInfoSection';
import DenseText from './DenseText';

export default function ExpoConstantsSummary(): JSX.Element {
  return (
    <DebugInfoSection title="Constants">
      <DenseText>
        {JSON.stringify({
          Constants,
          brand,
          designName,
          deviceName,
          deviceYearClass,
          isDevice,
          manufacturer,
          modelId,
          osBuildFingerprint,
          osBuildId,
          osInternalBuildId,
          osName,
          osVersion,
          platformApiLevel,
          productName,
          supportedCpuArchitectures,
          totalMemory,
        })}
      </DenseText>
    </DebugInfoSection>
  );
}

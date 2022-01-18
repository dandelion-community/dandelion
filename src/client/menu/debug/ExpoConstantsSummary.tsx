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
import DebugInfoSection from 'src/client/menu/debug/DebugInfoSection';
import DenseText from 'src/client/menu/debug/DenseText';

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

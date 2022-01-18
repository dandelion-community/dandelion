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
import DebugInfoSection from 'menu/debug/DebugInfoSection';
import DenseText from 'menu/debug/DenseText';
import * as React from 'react';

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

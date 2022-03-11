import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import AnimatedText from '../../Typography/AnimatedText';
import type { LabelBackgroundProps } from '../types';
const LabelBackground = ({
  parentState,
  labelProps: {
    placeholderStyle,
    baseLabelTranslateX,
    topPosition,
    hasActiveOutline,
    label,
    backgroundColor,
    roundness,
  },
  labelStyle,
}: LabelBackgroundProps) => {
  const hasFocus = hasActiveOutline || parentState.value;
  const opacity = parentState.labeled.interpolate({
    inputRange: [0, 1],
    outputRange: [hasFocus ? 1 : 0, 0],
  });
  const labelTranslationX = {
    transform: [
      {
        translateX: parentState.labeled.interpolate({
          inputRange: [0, 1],
          outputRange: [-baseLabelTranslateX, 0],
        }),
      },
    ],
  };
  return label
    ? [
        <Animated.View
          key="labelBackground-view"
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.view,
            {
              backgroundColor,
              bottom: Math.max(roundness, 2),
              maxHeight: Math.max(roundness / 3, 2),
              opacity,
            },
            labelTranslationX,
          ]}
        />,
        <AnimatedText
          key="labelBackground-text"
          numberOfLines={1}
          style={[
            placeholderStyle,
            labelStyle,
            styles.outlinedLabel,
            {
              backgroundColor,
              maxWidth:
                parentState.labelLayout.width -
                2 * placeholderStyle.paddingHorizontal,
              opacity,
              top: topPosition + 1,
              transform: [
                ...labelStyle.transform,
                {
                  scaleY: parentState.labeled.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {label}
        </AnimatedText>,
      ]
    : null;
};
export default LabelBackground;
const styles = StyleSheet.create({
  outlinedLabel: {
    color: 'transparent',
    left: 18,
    paddingHorizontal: 0,
    position: 'absolute',
  },
  view: {
    left: 10,
    position: 'absolute',
    top: 6,
    width: 12,
  },
});

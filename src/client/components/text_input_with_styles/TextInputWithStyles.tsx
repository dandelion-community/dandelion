import React, { useState } from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputProps,
  TextInputScrollEventData,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { PartType } from 'src/shared/utils/types';
import {
  generateValueFromPartsAndChangedText,
  parseValue,
} from 'src/shared/utils/mention_utils';
import { useColor } from '../Colors';
import TextWithStyles from './TextWithStyles';

type Props = TextInputProps & {
  onMount: () => void;
  partTypes: PartType[];
};

const TextInputWithStyles = React.forwardRef<NativeTextInput, Props>(
  (
    {
      partTypes,
      value,
      onChangeText: onChangeTextFromProps,
      onMount,
      ...props
    }: Props,
    ref,
  ): JSX.Element => {
    React.useEffect(onMount, []);
    const [scrollTop, setScrollTop] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const textColor = useColor('text');

    const top = -1 * scrollTop;
    const { parts, plainText } = parseValue(value ?? '', partTypes);
    function onScroll(e: NativeSyntheticEvent<TextInputScrollEventData>): void {
      setScrollTop((e.target as unknown as { scrollTop: number }).scrollTop);
    }
    function onLayout(e: LayoutChangeEvent): void {
      setHeight(e.nativeEvent.layout.height);
    }

    function onChangeText(changedText: string): void {
      onChangeTextFromProps?.(
        generateValueFromPartsAndChangedText(parts, plainText, changedText),
      );
    }

    return (
      <View style={styles.outerWrapper}>
        <NativeTextInput
          {...props}
          onChangeText={onChangeText}
          onLayout={onLayout}
          onScroll={onScroll}
          onSelectionChange={(
            e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
          ): void => {
            props.onSelectionChange?.(e);
          }}
          ref={ref}
          style={[
            props.style,
            { color: 'transparent' },
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            /* @ts-ignore */
            Platform.OS === 'web' ? { caretColor: textColor } : null,
          ]}
        />
        <View style={[styles.mirrorWrapper, { height }]}>
          <View style={styles.mirrorAnchor}>
            <View style={[styles.mirrorTranslated, { top }]}>
              <TextWithStyles
                partTypes={partTypes}
                style={props.style}
                value={value ?? ''}
              />
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  mirrorAnchor: { position: 'relative' },
  mirrorTranslated: { position: 'absolute' },
  mirrorWrapper: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
  outerWrapper: { position: 'relative' },
});

export default TextInputWithStyles;

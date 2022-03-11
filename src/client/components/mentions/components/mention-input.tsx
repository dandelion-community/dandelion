import React, { useMemo, useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput as NativeTextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';
import { TextInputHandles } from 'src/client/components/TextInput';
import TextInput from 'src/client/components/text_input/TextInput';
import type { RenderProps } from '../../text_input/types';
import { MentionInputProps, MentionPartType, Suggestion } from '../types';
import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from '../utils';

const MentionInput = React.forwardRef<TextInputHandles, MentionInputProps>(
  (
    {
      value,
      onChange,
      partTypes = [],
      containerStyle,
      onSelectionChange,
      // textStyle,
      ...textInputProps
    }: MentionInputProps,
    ref,
  ): JSX.Element => {
    const textInputRef = useRef<NativeTextInput | null>(null);
    React.useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
    }));

    const [selection, setSelection] = useState({ end: 0, start: 0 });
    const [scrollTop, setScrollTop] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const { plainText, parts } = useMemo(
      () => parseValue(value, partTypes),
      [value, partTypes],
    );
    const joinedParts = parts.map(({ text }) => text).join('');

    const handleSelectionChange = (
      event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
    ) => {
      setSelection(event.nativeEvent.selection);

      onSelectionChange && onSelectionChange(event);
    };

    /**
     * Callback that trigger on TextInput text change
     *
     * @param changedText
     */
    const onChangeInput = (changedText: string) => {
      onChange(
        generateValueFromPartsAndChangedText(parts, plainText, changedText),
      );
    };

    /**
     * We memoize the keyword to know should we show mention suggestions or not
     */
    const keywordByTrigger = useMemo(() => {
      return getMentionPartSuggestionKeywords(
        parts,
        plainText,
        selection,
        partTypes,
      );
    }, [parts, plainText, selection, partTypes]);

    /**
     * Callback on mention suggestion press. We should:
     * - Get updated value
     * - Trigger onChange callback with new value
     */
    const onSuggestionPress =
      (mentionType: MentionPartType) => (suggestion: Suggestion) => {
        const newValue = generateValueWithAddedSuggestion(
          parts,
          mentionType,
          plainText,
          selection,
          suggestion,
        );

        if (!newValue) {
          return;
        }

        onChange(newValue);

        /**
         * Move cursor to the end of just added mention starting from trigger string and including:
         * - Length of trigger string
         * - Length of mention name
         * - Length of space after mention (1)
         *
         * Not working now due to the RN bug
         */
        // const newCursorPosition = currentPart.position.start + triggerPartIndex + trigger.length +
        // suggestion.name.length + 1;

        // textInput.current?.setNativeProps({selection: {start: newCursorPosition, end: newCursorPosition}});
      };

    const renderMentionSuggestions = (mentionType: MentionPartType) => (
      <React.Fragment key={mentionType.trigger}>
        {mentionType.renderSuggestions &&
          mentionType.renderSuggestions({
            keyword: keywordByTrigger[mentionType.trigger],
            onSuggestionPress: onSuggestionPress(mentionType),
          })}
      </React.Fragment>
    );

    console.log('parts', parts);

    return (
      <ScrollView style={[containerStyle, { maxHeight: 100 }]}>
        {(
          partTypes.filter(
            (one) =>
              isMentionPartType(one) &&
              one.renderSuggestions != null &&
              !one.isBottomMentionSuggestionsRender,
          ) as MentionPartType[]
        ).map(renderMentionSuggestions)}
        <View collapsable={false}>
          <TextInput
            label="Add a comment"
            mode="outlined"
            multiline={true}
            {...textInputProps}
            onChangeText={onChangeInput}
            onSelectionChange={handleSelectionChange}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            /* @ts-ignore */
            ref={(ref) => {
              textInputRef.current = ref;
            }}
            render={(props: RenderProps) => {
              return (
                <View style={{ position: 'relative' }}>
                  <NativeTextInput
                    {...props}
                    onLayout={(e) => {
                      const { nativeEvent } = e;
                      const { layout } = nativeEvent;
                      const { height } = layout;
                      setHeight(height);
                    }}
                    onScroll={(e) => {
                      const top = (e.target as unknown as { scrollTop: number })
                        .scrollTop;
                      setScrollTop(top);
                    }}
                    style={[props.style, { color: 'transparent' }]}
                  />
                  <View
                    style={{
                      height,
                      overflow: 'hidden',
                      position: 'absolute',
                      width: '100%',
                    }}
                  >
                    <View style={{ position: 'relative' }}>
                      <View
                        style={{
                          position: 'absolute',
                          top: -1 * scrollTop,
                        }}
                      >
                        <Text style={[props.style]}>
                          {parts.map(({ text, partType, data }, index) =>
                            partType ? (
                              <Text
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${text}-${index}-${
                                  data?.trigger ?? 'pattern'
                                }`}
                                style={
                                  partType.textStyle ?? defaultMentionTextStyle
                                }
                              >
                                {text}
                              </Text>
                            ) : (
                              <Text
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${text}-${index}`}
                              >
                                {text}
                              </Text>
                            ),
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
            style={{ minHeight: 64 }}
            value={joinedParts}
          />
        </View>
        {/* <View
          style={{
            bottom: 0,
            flex: 1,
            flexDirection: 'column-reverse',
            height,
            left: 0,
            maxHeight: height,
            minHeight: height,
            paddingHorizontal: 12,
            paddingVertical: 21,
            position: 'absolute',
          }}
        >
          <Text>
            {parts.map(({ text, partType, data }, index) =>
              partType ? (
                <Text
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${text}-${index}-${data?.trigger ?? 'pattern'}`}
                  style={partType.textStyle ?? defaultMentionTextStyle}
                >
                  {text}
                </Text>
              ) : (
                <Text
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${text}-${index}`}
                  style={[textStyle, { color: 'green' }]}
                >
                  {text}
                </Text>
              ),
            )}
          </Text>
        </View> */}
        {(
          partTypes.filter(
            (one) =>
              isMentionPartType(one) &&
              one.renderSuggestions != null &&
              one.isBottomMentionSuggestionsRender,
          ) as MentionPartType[]
        ).map(renderMentionSuggestions)}
      </ScrollView>
    );
  },
);

export default MentionInput;

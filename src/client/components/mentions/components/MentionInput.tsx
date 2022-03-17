import React, { useMemo, useRef } from 'react';
import { TextInput as NativeTextInput, View } from 'react-native';
import { TextInputHandles } from 'src/client/components/TextInput';
import MaterialTextInputWithStyles from 'src/client/components/text_input_with_styles/MaterialTextInputWithStyles';
import {
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from 'src/shared/utils/mention_utils';
import {
  MentionInputProps,
  MentionPartType,
  Suggestion,
} from 'src/shared/utils/types';

const MentionInput = React.forwardRef<TextInputHandles, MentionInputProps>(
  (props: MentionInputProps, ref): JSX.Element => {
    const {
      autoFocus,
      value,
      onChangeText,
      partTypes = [],
      containerStyle,
      onSelectionChange,
      selection,
      ...textInputProps
    } = props;
    const textInputRef = useRef<NativeTextInput | null>(null);
    React.useImperativeHandle(ref, () => ({
      focus: () => {
        textInputRef.current?.focus();
      },
      setValue: (value: string): void => {
        textInputRef.current?.setNativeProps({ value });
      },
    }));

    const { plainText, parts } = useMemo(
      () => parseValue(value, partTypes),
      [value, partTypes],
    );

    /**
     * We memoize the keyword to know should we show mention suggestions or not
     */
    const keywordByTrigger = useMemo(() => {
      return getMentionPartSuggestionKeywords(
        parts,
        plainText,
        { end: selection?.end ?? 0, start: selection?.start ?? 0 },
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
        const { newValue, newCursorPosition } =
          generateValueWithAddedSuggestion(
            parts,
            mentionType,
            plainText,
            { end: selection?.end ?? 0, start: selection?.start ?? 0 },
            suggestion,
          );

        if (!newValue) {
          return;
        }

        onChangeText(newValue);

        /**
         * Move cursor to the end of just added mention starting from trigger string and including:
         * - Length of trigger string
         * - Length of mention name
         * - Length of space after mention (1)
         *
         * Not working now due to the RN bug
         */

        onSelectionChange({ end: newCursorPosition, start: newCursorPosition });

        textInputRef.current?.setNativeProps({
          selection: { end: newCursorPosition, start: newCursorPosition },
          value: parseValue(newValue, partTypes).plainText,
        });
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

    return (
      <View style={[containerStyle]}>
        {(
          partTypes.filter(
            (one) =>
              isMentionPartType(one) &&
              one.renderSuggestions != null &&
              !one.isBottomMentionSuggestionsRender,
          ) as MentionPartType[]
        ).map(renderMentionSuggestions)}
        <MaterialTextInputWithStyles
          autoFocus={autoFocus}
          label="Add a comment"
          onChangeText={onChangeText}
          onMount={() => {
            textInputRef.current?.setNativeProps({
              selection: { end: plainText.length, start: plainText.length },
              value: plainText,
            });
          }}
          onSelectionChange={onSelectionChange}
          partTypes={partTypes}
          ref={(ref) => {
            textInputRef.current = ref;
          }}
          selection={selection}
          value={value}
          {...textInputProps}
        />
        {(
          partTypes.filter(
            (one) =>
              isMentionPartType(one) &&
              one.renderSuggestions != null &&
              one.isBottomMentionSuggestionsRender,
          ) as MentionPartType[]
        ).map(renderMentionSuggestions)}
      </View>
    );
  },
);

export default MentionInput;

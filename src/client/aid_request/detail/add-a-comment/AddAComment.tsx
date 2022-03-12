import * as React from 'react';
import { /*Platform,*/ Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
// import { TextInput, useTheme } from 'react-native-paper';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import Row from 'src/client/aid_request/detail/components/Row';
import useEditAidRequestWithUndo from 'src/client/aid_request/edit/useEditAidRequestWithUndo';
import { useColor } from 'src/client/components/Colors';
import MentionInput from 'src/client/components/mentions/components/mention-input';
import { MentionSuggestionsProps } from 'src/client/components/mentions/types';
import Monogram from 'src/client/components/Monogram';
import { TextInputHandles } from 'src/client/components/TextInput';
import PinToBottomWhenFocused from 'src/client/global/pinned_input/PinToBottomWhenFocused';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';
import SendButton from './SendButton';

type Props = {
  aidRequestID: string;
};

export default function AddAComment({ aidRequestID }: Props): JSX.Element {
  const textInputRef = React.useRef<TextInputHandles | null>(null);
  const theme = useTheme();
  const textColor = useColor('text');
  const textStyle = {
    color: textColor,
    ...theme.fonts.regular,
  };
  const [value, setValue] = React.useState<string>('');
  const [focused, setFocused] = React.useState<boolean>(false);
  const { displayName } = useLoggedInViewer();
  const { mutate, loading } = useEditAidRequestWithUndo({
    aidRequestID,
    clearInputs: () => setValue(''),
    input: {
      action: AidRequestUpdateActionType.Add,
      event: AidRequestHistoryEventType.Comment,
      eventSpecificData: value,
    },
  });
  return (
    <PinToBottomWhenFocused isFocused={focused}>
      <Row omitTopMargin={true}>
        <View style={styles.row}>
          <View style={styles.monogramColumn}>
            <Monogram name={displayName} />
          </View>
          <View style={styles.textInput}>
            <MentionInput
              autoFocus={focused}
              onBlur={() => {
                setFocused(false);
              }}
              onChange={setValue}
              onFocus={() => {
                setFocused(true);
              }}
              partTypes={[
                {
                  renderSuggestions,
                  // The mention style in the input
                  textStyle: { color: '#8888ff' },
                  // Should be a single character like '@' or '#'
                  trigger: '@',
                },
              ]}
              ref={(ref) => {
                textInputRef.current = ref;
              }}
              style={[styles.text, textStyle]}
              textStyle={[
                styles.text,
                textStyle,
                { justifyContent: 'flex-end' },
              ]}
              value={value}
            />
          </View>
          <View style={styles.submitButtonColumn}>
            <SendButton
              hasContents={!!value}
              isSending={loading}
              send={mutate}
              startEditing={focusTextInput}
            />
          </View>
        </View>
      </Row>
    </PinToBottomWhenFocused>
  );

  function focusTextInput(): void {
    textInputRef.current?.focus();
  }

  function renderSuggestions({
    keyword,
    onSuggestionPress,
  }: MentionSuggestionsProps): React.ReactNode {
    if (keyword == null) {
      return null;
    }

    const suggestions: Array<Suggestion> = [
      { id: '1', name: 'David Tabaka' },
      { id: '2', name: 'Mary' },
      { id: '3', name: 'Tony' },
      { id: '4', name: 'Mike' },
      { id: '5', name: 'Grey' },
    ];

    return (
      <View>
        {suggestions
          .filter((one) =>
            one.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
          )
          .map((one) => (
            <Pressable
              key={one.id}
              onPress={() => onSuggestionPress(one)}
              style={{ padding: 12 }}
            >
              <Text>{one.name}</Text>
            </Pressable>
          ))}
      </View>
    );
  }
}

type Suggestion = {
  id: string;
  name: string;
};

const styles = StyleSheet.create({
  monogramColumn: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexGrow: 0,
    marginRight: 4,
    marginTop: 18,
  },
  row: {
    flexDirection: 'row',
  },
  submitButtonColumn: {
    alignItems: 'flex-end',
    flexDirection: 'column-reverse',
    flexGrow: 0,
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
  },
  textInput: {
    flexGrow: 1,
    padding: 8,
  },
});

import * as React from 'react';
import { ScrollView, StyleSheet, TextInputProps, View } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import Row from 'src/client/aid_request/detail/components/Row';
import useEditAidRequestWithUndo from 'src/client/aid_request/edit/useEditAidRequestWithUndo';
import { useColor } from 'src/client/components/Colors';
import MentionInput from 'src/client/components/mentions/components/MentionInput';
import {
  MentionSuggestionsProps,
  Position,
} from 'src/shared/utils/types';
import Monogram from 'src/client/components/Monogram';
import { TextInputHandles } from 'src/client/components/TextInput';
import MentionPartType from 'src/shared/utils/MentionPartType';
import ViewWithBackground from 'src/client/components/ViewWithBackground';
import PinToBottomWhenFocused from 'src/client/global/pinned_input/PinToBottomWhenFocused';
import useIsLargeScreen from 'src/client/screen_size/useIsLargeScreen';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';
import SendButton from './SendButton';

type Props = {
  aidRequestID: string;
};

export default function AddAComment({ aidRequestID }: Props): JSX.Element {
  const textInputRef = React.useRef<TextInputHandles | null>(null);
  const theme = useTheme();
  const textColor = useColor('text');
  const isLargeScreen = useIsLargeScreen();
  const viewer = useLoggedInViewer();
  const textStyle = {
    color: textColor,
    ...theme.fonts.regular,
  };
  const [value, setValue] = React.useState<string>('');
  const [focused, setFocused] = React.useState<boolean>(false);
  const [selection, setSelection] = React.useState<TextInputProps['selection']>(
    { end: 0, start: 0 },
  );
  const blurTimeout = React.useRef<NodeJS.Timeout | undefined>();
  const focusTimeout = React.useRef<NodeJS.Timeout | undefined>();
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
                clearTimeout(focusTimeout.current as unknown as number);
                blurTimeout.current = setTimeout(() => {
                  setFocused(false);
                }, 400);
              }}
              onChangeText={(val: string): void => {
                setValue(val);
                clearTimeout(blurTimeout.current as unknown as number);
                focusTimeout.current = setTimeout(() => {
                  textInputRef.current?.focus();
                });
              }}
              onFocus={() => {
                clearTimeout(blurTimeout.current as unknown as number);
                setFocused(true);
              }}
              onSelectionChange={(selection: Position): void => {
                setSelection(selection);
              }}
              partTypes={[
                {
                  ...MentionPartType,
                  isBottomMentionSuggestionsRender: isLargeScreen,
                  renderSuggestions,
                },
              ]}
              ref={(ref) => {
                textInputRef.current = ref;
              }}
              selection={selection}
              style={[textStyle]}
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
    if (keyword == null || !focused) {
      return null;
    }

    const suggestions: Array<Suggestion> = viewer.taggableUsers
      .map(({ displayName, id }) => ({
        id,
        name: displayName,
      }))
      .filter((elem) =>
        elem.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
      );

    return (
      <ScrollView style={{ maxHeight: 200 }}>
        <ViewWithBackground
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {suggestions.map((elem) => (
            <List.Item
              key={elem.id}
              left={() => {
                return (
                  <View style={{ marginTop: 6 }}>
                    <Monogram name={elem.name} />
                  </View>
                );
              }}
              onPress={(): void => {
                onSuggestionPress(elem);
              }}
              title={elem.name}
            />
          ))}
        </ViewWithBackground>
      </ScrollView>
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
    flexDirection: 'column-reverse',
    flexGrow: 0,
    marginBottom: 30,
    marginRight: 4,
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
  textInput: {
    flexGrow: 1,
    padding: 8,
  },
});

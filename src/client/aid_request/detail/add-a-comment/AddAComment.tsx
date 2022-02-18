import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import { broadcastUpdatedAidRequest } from 'src/client/aid_request/cache/broadcastAidRequestUpdates';
import Row from 'src/client/aid_request/detail/components/Row';
import { EDIT_AID_REQUEST_MUTATION } from 'src/client/aid_request/edit/EditAidRequestMutation';
import {
  EditAidRequestMutation,
  EditAidRequestMutationVariables,
  EditAidRequestMutation_payload_object,
} from 'src/client/aid_request/edit/__generated__/editAidRequestMutation';
import Monogram from 'src/client/components/Monogram';
import useMutateWithUndo from 'src/client/graphql/useMutateWithUndo';
import { useLoggedInViewer } from 'src/client/viewer/Viewer';
import SendButton from './SendButton';

type Props = {
  aidRequestID: string;
};

export default function AddAComment({ aidRequestID }: Props): JSX.Element {
  const textInputRef = React.useRef<NativeTextInput | undefined | null>();
  const [value, setValue] = React.useState<string>('');
  const [contentHeight, setContentHeight] = React.useState<number>(20);
  const { displayName } = useLoggedInViewer();
  const { mutate, loading } = useMutateWithUndo<
    EditAidRequestMutation_payload_object,
    EditAidRequestMutation,
    EditAidRequestMutationVariables
  >({
    broadcastResponse: (
      object: EditAidRequestMutation_payload_object | null,
    ) => {
      broadcastUpdatedAidRequest(aidRequestID, object);
    },
    clearInputs: () => setValue(''),
    mutation: EDIT_AID_REQUEST_MUTATION,
    variables: {
      aidRequestID,
      input: {
        action: AidRequestUpdateActionType.Add,
        event: AidRequestHistoryEventType.Comment,
        eventSpecificData: value,
      },
    },
  });
  const style = { height: contentHeight + (Platform.OS === 'ios' ? 16 : 0) };
  return (
    <Row omitTopMargin={true}>
      <View style={styles.row}>
        <View style={styles.monogramColumn}>
          <Monogram name={displayName} />
        </View>
        <View style={styles.textInput}>
          <TextInput
            autoComplete="off"
            dense={true}
            disabled={loading}
            label="Add a comment"
            maxLength={1 << 16}
            mode="outlined"
            multiline={true}
            onChangeText={setValue}
            onContentSizeChange={onContentSizeChange}
            ref={(ref) => {
              textInputRef.current = ref;
            }}
            style={style}
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
  );

  function onContentSizeChange(event: {
    nativeEvent: { contentSize: { width: number; height: number } };
  }): void {
    setContentHeight(event.nativeEvent.contentSize.height);
  }

  function focusTextInput(): void {
    textInputRef.current?.focus();
  }
}

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
  textInput: {
    flexGrow: 1,
  },
});

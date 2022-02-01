import { useMutation } from '@apollo/client';
import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {
  AidRequestHistoryEventType,
  AidRequestUpdateActionType,
} from 'src/../__generated__/globalTypes';
import Row from 'src/client/aid_request/detail/components/Row';
import { EDIT_AID_REQUEST_MUTATION } from 'src/client/aid_request/edit/EditAidRequestMutation';
import {
  EditAidRequestMutation,
  EditAidRequestMutationVariables,
} from 'src/client/aid_request/edit/__generated__/editAidRequestMutation';
import Icon from 'src/client/components/Icon';
import Monogram from 'src/client/components/Monogram';
import client from 'src/client/graphql/client';
import { broadcastAidRequestUpdated } from 'src/client/request_explorer/AidRequestFilterLocalCacheUpdater';
import useToastContext from 'src/client/toast/useToastContext';
import { useLoggedInViewer } from 'src/client/viewer/ViewerContext';

type Props = {
  aidRequestID: string;
};

export default function AddAComment({ aidRequestID }: Props): JSX.Element {
  const textInputRef = React.useRef<NativeTextInput | undefined | null>();
  const [value, setValue] = React.useState<string>('');
  const [contentHeight, setContentHeight] = React.useState<number>(20);
  const { displayName, id: viewerID } = useLoggedInViewer();
  const { publishToast } = useToastContext();
  const [runEditAidRequestMutation, { loading }] = useMutation<
    EditAidRequestMutation,
    EditAidRequestMutationVariables
  >(EDIT_AID_REQUEST_MUTATION);
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
            style={{ height: contentHeight + Platform.OS === 'ios' ? 16 : 0 }}
            value={value}
          />
        </View>
        <View style={styles.submitButtonColumn}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableRipple onPress={value ? submit : focusTextInput}>
              <Icon path={value ? 'send' : 'comment'} size={24} />
            </TouchableRipple>
          )}
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

  async function submit(): Promise<void> {
    const variables = {
      aidRequestID,
      input: {
        action: AidRequestUpdateActionType.Add,
        event: AidRequestHistoryEventType.Comment,
        eventSpecificData: value,
      },
    };
    const { data } = await runEditAidRequestMutation({ variables });
    setValue('');
    broadcastAidRequestUpdated(aidRequestID, data?.editAidRequest?.aidRequest, {
      viewerID,
    });
    const editAidRequest = data?.editAidRequest;
    if (editAidRequest != null) {
      const { undoID } = editAidRequest;
      publishToast({
        message: editAidRequest.postpublishSummary || 'Updated',
        undo:
          undoID == null
            ? null
            : async () => {
                const { data } = await client.mutate({
                  mutation: EDIT_AID_REQUEST_MUTATION,
                  variables: { ...variables, undoID },
                });
                broadcastAidRequestUpdated(
                  aidRequestID,
                  data?.editAidRequest?.aidRequest,
                  { viewerID },
                );
              },
      });
    }
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
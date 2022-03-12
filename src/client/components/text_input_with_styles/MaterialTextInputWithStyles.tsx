import React from 'react';
import {
  NativeSyntheticEvent,
  TextInput as NativeTextInput,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { MentionInputProps } from 'src/shared/utils/types';
import TextInputWithStyles from './TextInputWithStyles';

type Props = MentionInputProps & {
  label: string;
  onMount: () => void;
};

const MaterialTextInputWithStyles = React.forwardRef<NativeTextInput, Props>(
  (props: Props, ref): JSX.Element => {
    const { partTypes, onSelectionChange, onMount, ...textInputProps } = props;
    const renderTextInput = React.useCallback(
      (props): React.ReactNode => {
        return (
          <TextInputWithStyles
            {...props}
            onMount={onMount}
            partTypes={partTypes}
          />
        );
      },
      [partTypes],
    );

    return (
      <TextInput
        mode="outlined"
        multiline={true}
        {...textInputProps}
        onSelectionChange={(
          e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
        ): void => {
          onSelectionChange(e.nativeEvent.selection);
        }}
        ref={ref}
        render={renderTextInput}
      />
    );
  },
);

export default MaterialTextInputWithStyles;

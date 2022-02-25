import * as React from 'react';
import { Platform, StyleProp, TextInput, TextStyle } from 'react-native';
import { useColor } from 'src/client/components/Colors';

type Props = {
  value: string;
  save: (newValue: string) => Promise<unknown>;
  style: StyleProp<TextStyle>;
};

export default function WhoIsItFor({ value, save, style }: Props): JSX.Element {
  const color = useColor('text');
  const [temporaryValue, setTemporaryValue] = React.useState<string>(value);

  // If there's already an ongoing save in progress, don't initiate a new one
  // until the old one is done.
  const isInProgress = React.useRef<boolean>(false);
  const whenDone = React.useRef<(() => Promise<void>) | undefined>(undefined);
  const valueWeWantToBeCommitted = React.useRef<string>(value);

  React.useEffect(() => {
    if (!isInProgress.current) {
      setTemporaryValue(value);
      valueWeWantToBeCommitted.current = value;
    }
  }, [value]);
  return (
    <TextInput
      autoComplete="off"
      autoFocus={false}
      onBlur={doneEditing}
      onChangeText={setTemporaryValue}
      onSubmitEditing={doneEditing}
      returnKeyType="done"
      style={[
        style,
        { color },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore ts thinks outline: 'none'  is invalid but it's not
        Platform.OS === 'web' ? { outline: 'none' } : {},
      ]}
      underlineColorAndroid="transparent"
      value={temporaryValue}
    />
  );

  function doneEditing(): void {
    if (temporaryValue) {
      if (temporaryValue !== valueWeWantToBeCommitted.current) {
        maybeSave(temporaryValue);
      }
    } else {
      setTemporaryValue(valueWeWantToBeCommitted.current);
    }
  }

  async function maybeSave(newValue: string): Promise<void> {
    valueWeWantToBeCommitted.current = newValue;
    if (isInProgress.current) {
      // Wait for the current save to be done.
      // Ok to override the waiting function, because if we
      // were planning to save some other value when the
      // current save was done, but now we have a new
      // one we want to save, we don't
      // need to bother saving the old pending value.
      whenDone.current = () => execSave(newValue);
    } else {
      await execSave(newValue);
    }
  }

  async function execSave(newValue: string): Promise<void> {
    isInProgress.current = true;
    await save(newValue);
    const whenDoneFn = whenDone.current;
    whenDone.current = undefined;
    if (whenDoneFn != null) {
      await whenDoneFn();
    }
    isInProgress.current = false;
  }
}

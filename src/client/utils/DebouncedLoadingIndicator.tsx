import * as React from 'react';
import { ActivityIndicator } from 'react-native-paper';

const DEBOUNCE_MS = 100;

export default function DebouncedLoadingIndicator(): JSX.Element {
  const [show, setShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    const timeoutID = setTimeout(() => setShow(true), DEBOUNCE_MS);
    return () => {
      clearTimeout(timeoutID);
    };
  });
  return <ActivityIndicator animating={show} />;
}

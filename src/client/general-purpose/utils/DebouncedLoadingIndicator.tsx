import * as React from 'react';
import { ActivityIndicator } from 'react-native-paper';

const DEBOUNCE_MS = 300;

export default function DebouncedLoadingIndicator(): JSX.Element {
  const [show, setShow] = React.useState<boolean>(false);
  React.useEffect(() => {
    setTimeout(() => setShow(true), DEBOUNCE_MS);
  });
  return <ActivityIndicator animating={show} />;
}

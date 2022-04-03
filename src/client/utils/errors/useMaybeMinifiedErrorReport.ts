import { ApolloError } from '@apollo/client';
import * as React from 'react';
import uploadErrorReport from './uploadErrorReport';
import useErrorReport from './useErrorReport';

export default function useMaybeMinifiedErrorReport(
  arg: ApolloError | ApolloError[],
): {
  errorMessage: string;
  debugInfo: string;
} {
  const { errorMessage, rawDebugInfo: rawValue } = useErrorReport(arg);

  const [minifiedValue, setMinifiedValue] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setMinifiedValue(undefined);
    uploadErrorReport(rawValue).then(({ minifiedValue }) =>
      setMinifiedValue(minifiedValue),
    );
  }, [rawValue]);

  return {
    debugInfo: minifiedValue ?? rawValue,
    errorMessage,
  };
}

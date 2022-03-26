import { ApolloError, ServerError } from '@apollo/client';
import { Buffer } from 'buffer';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import { useEncodedRootNavigationStoreForErrorReporting } from 'src/client/navigation/root/RootNavigationStore';
import useStore from 'src/client/store/useStore';
import { useEncodedViewerForErrorReporting } from 'src/client/viewer/Viewer';
import flatten from 'src/shared/utils/flatten';
import uniques from 'src/shared/utils/uniques';

export default function useErrorReport(arg: ApolloError | ApolloError[]): {
  errorMessage: string;
  rawDebugInfo: string;
} {
  const errorMessages: ApolloError[] = Array.isArray(arg) ? arg : [arg];
  const errors = flatten(errorMessages.map(getErrorMessage));
  const navState = useEncodedRootNavigationStoreForErrorReporting();
  const viewer = useEncodedViewerForErrorReporting();
  const search = useStore(GlobalSearchStringStore);
  const url = window?.location?.toString();
  const value = {
    errors,
    navState,
    search,
    url,
    viewer,
  };

  const rawValue = Buffer.from(JSON.stringify(value), 'utf-8').toString(
    'base64',
  );
  const uniqueMessages = uniques(
    errors.map(({ errorMessage }) => errorMessage),
  );

  return {
    errorMessage:
      uniqueMessages.length === 0
        ? 'Unknown Error'
        : uniqueMessages.length === 1
        ? uniqueMessages[0]
        : `${uniqueMessages.length} errors`,
    rawDebugInfo: rawValue,
  };
}

type ParsedErrorData = {
  errorMessage: string;
  properties?: Record<string, string> | undefined;
  file?: string | undefined;
};

function getErrorMessage(error: ApolloError): ParsedErrorData[] {
  try {
    const { networkError, graphQLErrors } = error;
    if (networkError != null) {
      return (networkError as ServerError).result.errors.map(
        ({ message }: { message: string }) =>
          maybeParse(message, 'Network Error'),
      );
    }
    if (graphQLErrors != null && graphQLErrors.length > 0) {
      return graphQLErrors.map(({ message, path }) =>
        maybeParse(message, 'Server Error', { path: JSON.stringify(path) }),
      );
    }
  } catch {
    return [maybeParse(error.message, 'Unexpected error')];
  }
  return [maybeParse(error.message, 'Unexpected error')];

  function maybeParse(
    msg: string,
    fallback: string,
    props?: Record<string, string> | undefined,
  ): ParsedErrorData {
    try {
      const { displayText: errorMessage, properties, file } = JSON.parse(msg);
      return {
        errorMessage,
        file,
        properties: { ...properties, ...(props ?? {}) },
      };
    } catch {
      return {
        errorMessage: fallback,
        properties: { dump: JSON.stringify(error) },
      };
    }
  }
}

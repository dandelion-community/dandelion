import { ApolloError, gql, ServerError } from '@apollo/client';
import { Buffer } from 'buffer';
import * as React from 'react';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import client from 'src/client/graphql/client';
import { useEncodedRootNavigationStoreForErrorReporting } from 'src/client/navigation/root/RootNavigationStore';
import useStore from 'src/client/store/useStore';
import type {
  CreateErrorReportMutation,
  CreateErrorReportMutationVariables,
} from 'src/client/utils/__generated__/CreateErrorReportMutation';
import { useEncodedViewerForErrorReporting } from 'src/client/viewer/Viewer';

export default function useDebugInfo(error: ApolloError): {
  errorMessage: string;
  debugInfo: string;
} {
  const { errorMessage, properties, file } = getErrorMessage(error);
  const navState = useEncodedRootNavigationStoreForErrorReporting();
  const viewer = useEncodedViewerForErrorReporting();
  const search = useStore(GlobalSearchStringStore);
  const url = window?.location?.toString();
  const value = {
    errorMessage,
    file,
    navState,
    search,
    url,
    viewer,
    ...properties,
  };

  const rawValue = Buffer.from(JSON.stringify(value), 'utf-8').toString(
    'base64',
  );

  const [minifiedValue, setMinifiedValue] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setMinifiedValue(undefined);
    client
      .mutate<CreateErrorReportMutation, CreateErrorReportMutationVariables>({
        mutation: CREATE_ERROR_REPORT_MUTATION,
        variables: { data: rawValue },
      })
      .then((res) => {
        setMinifiedValue(res?.data?.reportError ?? undefined);
      });
  }, [rawValue]);

  return {
    debugInfo: minifiedValue ?? rawValue,
    errorMessage,
  };
}

const CREATE_ERROR_REPORT_MUTATION = gql`
  mutation CreateErrorReportMutation($data: String!) {
    reportError(data: $data)
  }
`;

type ParsedErrorData = {
  errorMessage: string;
  properties?: Record<string, string> | undefined;
  file?: string | undefined;
};

function getErrorMessage(error: ApolloError): ParsedErrorData {
  try {
    const { networkError, graphQLErrors } = error;
    if (networkError != null) {
      return maybeParse(
        (networkError as ServerError).result.errors[0].message,
        'Network error',
      );
    }
    if (graphQLErrors != null && graphQLErrors.length > 0) {
      return maybeParse(graphQLErrors[0].message, 'Server Error');
    }
  } catch {
    return maybeParse(error.message, 'Unexpected error');
  }
  return maybeParse(error.message, 'Unexpected error');

  function maybeParse(msg: string, fallback: string): ParsedErrorData {
    try {
      const { displayText: errorMessage, properties, file } = JSON.parse(msg);
      return { errorMessage, file, properties };
    } catch {
      return {
        errorMessage: fallback,
        properties: { dump: JSON.stringify(error) },
      };
    }
  }
}

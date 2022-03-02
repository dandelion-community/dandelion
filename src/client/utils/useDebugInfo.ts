import { ApolloError, gql, ServerError } from '@apollo/client';
import { Buffer } from 'buffer';
import * as React from 'react';
import GlobalSearchStringStore from 'src/client/global_search_string/GlobalSearchStringStore';
import client from 'src/client/graphql/client';
import RootNavigationStore from 'src/client/navigation/RootNavigationStore';
import useStore from 'src/client/store/useStore';
import type {
  CreateErrorReportMutation,
  CreateErrorReportMutationVariables,
} from 'src/client/utils/__generated__/CreateErrorReportMutation';
import { useViewer } from 'src/client/viewer/Viewer';

export default function useDebugInfo(error: ApolloError): {
  errorMessage: string;
  debugInfo: string;
} {
  const errorMessage = getErrorMessage(error);
  const navState = useStore(RootNavigationStore)?.getState() ?? {};
  const viewer = useViewer();
  const search = useStore(GlobalSearchStringStore);
  const url = window?.location?.toString();
  const value = {
    errorMessage,
    navState,
    search,
    url,
    viewer,
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

function getErrorMessage(error: ApolloError): string {
  try {
    const { networkError, graphQLErrors } = error;
    if (networkError != null) {
      return Object.values(networkError as ServerError)[0].errors.message;
    }
    if (graphQLErrors != null) {
      return 'Server Error';
    }
    return error.message;
  } catch (e) {
    return JSON.stringify(error);
  }
}

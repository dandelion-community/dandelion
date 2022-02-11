import { ApolloError, gql } from '@apollo/client';
import { Buffer } from 'buffer';
import * as React from 'react';
import client from 'src/client/graphql/client';
import RootNavigationContext from 'src/client/navigation/RootNavigationContext';
import SearchContext from 'src/client/search/SearchContext';
import type {
  CreateErrorReportMutation,
  CreateErrorReportMutationVariables,
} from 'src/client/utils/__generated__/CreateErrorReportMutation';
import ViewerContext from 'src/client/viewer/ViewerContext';

export default function useDebugInfo(error: ApolloError): {
  errorMessage: string;
  debugInfo: string;
} {
  const errorMessage =
    (error.networkError as { result?: { errors: Error[] } }).result?.errors[0]
      .message ?? error.message;
  const navState =
    React.useContext(RootNavigationContext)?.rootNavigation?.getState() ?? {};
  const viewer = React.useContext(ViewerContext);
  const search = React.useContext(SearchContext)?.searchString ?? '';
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

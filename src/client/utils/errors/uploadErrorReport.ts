import { gql } from '@apollo/client';
import client from 'src/client/graphql/client';
import {
  CreateErrorReportMutation,
  CreateErrorReportMutationVariables,
} from '../__generated__/CreateErrorReportMutation';

type Result = {
  uploadedSuccessfully: boolean;
  value: string;
  minifiedValue: string | undefined;
};

export default async function uploadErrorReport(
  rawErrorReport: string,
): Promise<Result> {
  const res = await client.mutate<
    CreateErrorReportMutation,
    CreateErrorReportMutationVariables
  >({
    mutation: CREATE_ERROR_REPORT_MUTATION,
    variables: { data: rawErrorReport },
  });
  const value = res?.data?.reportError;
  return {
    minifiedValue: value ?? undefined,
    uploadedSuccessfully: value != null,
    value: value ?? rawErrorReport,
  };
}

const CREATE_ERROR_REPORT_MUTATION = gql`
  mutation CreateErrorReportMutation($data: String!) {
    reportError(data: $data)
  }
`;

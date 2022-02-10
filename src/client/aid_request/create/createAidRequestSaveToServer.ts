import { gql } from '@apollo/client';
import { SuccessfulSaveData } from 'src/client/aid_request/drafts/AidRequestDrafts';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';
import type { CreateAidRequestsMutationVariables } from 'src/client/create_request/__generated__/CreateAidRequestsMutation';
import { tryOrYieldNullOnError } from 'src/client/error/tryCatch';
import client from 'src/client/graphql/client';
import filterNulls from 'src/shared/utils/filterNulls';

export default async function createAidRequestSaveToServer(
  variables: CreateAidRequestsMutationVariables,
): Promise<null | SuccessfulSaveData> {
  return tryOrYieldNullOnError<null | SuccessfulSaveData>(
    async (): Promise<null | SuccessfulSaveData> => {
      const { data } = await client.mutate({
        mutation: CREATE_AID_REQUESTS_MUTATION,
        variables,
      });
      const aidRequests = data?.createAidRequests?.requests;
      const postpublishSummary = data?.createAidRequests?.postpublishSummary;
      if (aidRequests == null || postpublishSummary == null) {
        return null;
      }
      return {
        aidRequests: filterNulls(aidRequests),
        postpublishSummary,
      };
    },
  );
}

const CREATE_AID_REQUESTS_MUTATION = gql`
  mutation CreateAidRequestsMutation(
    $crew: String!
    $whatIsNeeded: [String!]!
    $whoIsItFor: String!
  ) {
    createAidRequests(
      crew: $crew
      whatIsNeeded: $whatIsNeeded
      whoIsItFor: $whoIsItFor
    ) {
      postpublishSummary
      requests {
        ...AidRequestCardFragment
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

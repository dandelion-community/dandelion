import { gql } from '@apollo/client';
import type {
  CreateAidRequestsMutation,
  CreateAidRequestsMutationVariables,
} from 'src/client/aid_request/create/__generated__/CreateAidRequestsMutation';
import { SuccessfulSaveData } from 'src/client/aid_request/drafts/AidRequestDrafts';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';
import { tryOrYieldNullOnError } from 'src/client/error/tryCatch';
import client from 'src/client/graphql/client';
import filterNulls from 'src/shared/utils/filterNulls';
import { validate } from '../fragments/AidRequestGraphQLType';

export default async function createAidRequestSaveToServer(
  variables: CreateAidRequestsMutationVariables,
): Promise<null | SuccessfulSaveData> {
  return tryOrYieldNullOnError<null | SuccessfulSaveData>(
    async (): Promise<null | SuccessfulSaveData> => {
      const { data, errors } = await client.mutate<
        CreateAidRequestsMutation,
        CreateAidRequestsMutationVariables
      >({
        mutation: CREATE_AID_REQUESTS_MUTATION,
        variables,
      });
      const aidRequests = data?.createAidRequests?.requests;
      const postpublishSummary = data?.createAidRequests?.postpublishSummary;
      if (aidRequests == null || postpublishSummary == null) {
        return null;
      }
      return {
        aidRequests: filterNulls(aidRequests.map(validate)),
        errors,
        postpublishSummary,
      };
    },
  );
}

const CREATE_AID_REQUESTS_MUTATION = gql`
  mutation CreateAidRequestsMutation(
    $crew: String!
    $whatIsNeeded: [String!]!
    $whoIsItFor: String
    $whoIsItForMulti: [String!]
  ) {
    createAidRequests(
      crew: $crew
      whatIsNeeded: $whatIsNeeded
      whoIsItFor: $whoIsItFor
      whoIsItForMulti: $whoIsItForMulti
    ) {
      postpublishSummary
      requests {
        ...AidRequestCardFragment
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

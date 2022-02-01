import { gql } from '@apollo/client';
import { AidRequestCardFragments } from 'src/client/aid_request/fragments/AidRequestCardFragments';

export const EDIT_AID_REQUEST_MUTATION = gql`
  mutation EditAidRequestMutation(
    $aidRequestID: String!
    $input: AidRequestActionInputInput!
    $undoID: String
  ) {
    editAidRequest(
      aidRequestID: $aidRequestID
      input: $input
      undoID: $undoID
    ) {
      aidRequest {
        ...AidRequestCardFragment
      }
      undoID
      postpublishSummary
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

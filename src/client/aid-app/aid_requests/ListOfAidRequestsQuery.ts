import { gql } from '@apollo/client';
import { AidRequestCardFragments } from './AidRequestCardFragments';

export const PAGE_SIZE = 5;

export const LIST_OF_AID_REQUESTS_QUERY = gql`
  query ListOfAidRequestsQuery(
    $pageSize: Int!
    $after: String
    $filter: FilterFindManyAidRequestInput
  ) {
    allAidRequests(first: $pageSize, after: $after, filter: $filter) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...AidRequestCardFragment
        }
      }
    }
  }
  ${AidRequestCardFragments.aidRequest}
`;

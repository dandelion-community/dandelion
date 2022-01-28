import { gql } from '@apollo/client';
import { Dimensions } from 'react-native';
import { AidRequestCardFragments } from './AidRequestCardFragments';

const windowHeight = Dimensions.get('window').height;
const APPROX_REQUEST_ITEM_HEIGHT = 86;

export const PAGE_SIZE = Math.max(
  5,
  Math.ceil((windowHeight / APPROX_REQUEST_ITEM_HEIGHT) * 1.5),
);

export const LIST_OF_AID_REQUESTS_QUERY = gql`
  query ListOfAidRequestsQuery(
    $pageSize: Int!
    $after: String
    $filter: AidRequestFilterInput
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

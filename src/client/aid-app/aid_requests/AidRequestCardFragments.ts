import { gql } from '@apollo/client';

export const AidRequestIsCompleteToggleFragments = {
  aidRequest: gql`
    fragment AidRequestIsCompleteToggleFragment on AidRequest {
      _id
      completed
    }
  `,
};

export const AidRequestCardFragments = {
  aidRequest: gql`
    fragment AidRequestCardFragment on AidRequest {
      _id
      whatIsNeeded
      whoIsItFor
      whoRecordedItUsername
      ...AidRequestIsCompleteToggleFragment
    }
    ${AidRequestIsCompleteToggleFragments.aidRequest}
  `,
};

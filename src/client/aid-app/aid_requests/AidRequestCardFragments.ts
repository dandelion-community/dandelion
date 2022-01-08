import { gql } from '@apollo/client';

export const AidRequestIsCompleteToggleFragments = {
  aidRequest: gql`
    fragment AidRequestIsCompleteToggleFragment on AidRequest {
      _id
      completed
    }
  `,
};

export const AidRequestWorkingOnItSummaryFragments = {
  aidRequest: gql`
    fragment AidRequestWorkingOnItSummaryFragment on AidRequest {
      _id
      whoIsWorkingOnItUsers {
        username
        _id
      }
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
      ...AidRequestWorkingOnItSummaryFragment
    }
    ${AidRequestIsCompleteToggleFragments.aidRequest}
    ${AidRequestWorkingOnItSummaryFragments.aidRequest}
  `,
};

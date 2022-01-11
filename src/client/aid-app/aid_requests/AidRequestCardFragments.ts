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
        displayName
        _id
      }
    }
  `,
};

export const AidRequestCardFragments = {
  aidRequest: gql`
    fragment AidRequestCardFragment on AidRequest {
      _id
      latestEvent
      whatIsNeeded
      whoIsItFor
      whoRecordedIt {
        displayName
      }
      ...AidRequestIsCompleteToggleFragment
      ...AidRequestWorkingOnItSummaryFragment
    }
    ${AidRequestIsCompleteToggleFragments.aidRequest}
    ${AidRequestWorkingOnItSummaryFragments.aidRequest}
  `,
};

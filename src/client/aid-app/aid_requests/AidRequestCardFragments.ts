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

export const AidRequestEditDrawerFragments = {
  aidRequest: gql`
    fragment AidRequestEditDrawerFragment on AidRequest {
      _id
      actionsAvailable {
        message
        input {
          action
          details {
            event
          }
        }
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
      ...AidRequestEditDrawerFragment
    }
    ${AidRequestIsCompleteToggleFragments.aidRequest}
    ${AidRequestWorkingOnItSummaryFragments.aidRequest}
    ${AidRequestEditDrawerFragments.aidRequest}
  `,
};

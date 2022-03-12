import { gql } from '@apollo/client';

export const AidRequestEditDrawerFragments = {
  aidRequest: gql`
    fragment AidRequestEditDrawerFragment on AidRequest {
      _id
      actionsAvailable {
        icon
        message
        input {
          action
          event
        }
      }
    }
  `,
};

export const AidRequestCardFragments = {
  aidRequest: gql`
    fragment AidRequestCardFragment on AidRequest {
      _id
      createdAt
      crew
      completed
      lastUpdated
      latestEvent
      whatIsNeeded
      whoIsItFor
      whoRecordedIt {
        displayName
      }
      whoIsWorkingOnItUsers {
        _id
      }
      ...AidRequestEditDrawerFragment
    }
    ${AidRequestEditDrawerFragments.aidRequest}
  `,
};

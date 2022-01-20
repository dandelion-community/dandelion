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
      completed
      latestEvent
      whatIsNeeded
      whoIsItFor
      whoRecordedIt {
        displayName
        username
      }
      whoIsWorkingOnItUsers {
        _id
      }
      ...AidRequestEditDrawerFragment
    }
    ${AidRequestEditDrawerFragments.aidRequest}
  `,
};

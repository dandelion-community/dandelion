import { gql, useQuery } from '@apollo/client';
import Loading from 'utils/loading';
import * as React from 'react';
import type { Viewer } from './ViewerContext';
import type { ViewerQuery } from './__generated__/ViewerQuery';

const VIEWER_QUERY = gql`
  query ViewerQuery {
    me {
      _id
      username
      displayName
    }
  }
`;

export default function useLoadViewer(): Viewer {
  const { data, loading } = useQuery<ViewerQuery>(VIEWER_QUERY);
  const username = data?.me?.username;
  const id = data?.me?._id;
  const displayName = data?.me?.displayName || username;
  return React.useMemo((): Viewer => {
    if (loading) {
      return {
        displayName: Loading,
        id: Loading,
        username: Loading,
      };
    } else if (username == null || id == null || displayName == null) {
      return {
        displayName: undefined,
        id: undefined,
        username: undefined,
      };
    } else {
      return {
        displayName,
        id,
        username,
      };
    }
  }, [username, loading, id]);
}

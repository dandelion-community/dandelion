import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import Loading from '../utils/loading';
import type { Viewer } from './ViewerContext';
import type { ViewerQuery } from './__generated__/ViewerQuery';

const VIEWER_QUERY = gql`
  query ViewerQuery {
    me {
      _id
      username
    }
  }
`;

export default function useLoadViewer(): Viewer {
  const { data, loading } = useQuery<ViewerQuery>(VIEWER_QUERY);
  const username = data?.me?.username;
  const id = data?.me?._id;
  return React.useMemo((): Viewer => {
    if (loading) {
      return {
        id: Loading,
        username: Loading,
      };
    } else if (username == null || id == null) {
      return {
        id: undefined,
        username: undefined,
      };
    } else {
      return {
        id,
        username,
      };
    }
  }, [username, loading, id]);
}

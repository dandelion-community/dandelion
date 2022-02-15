import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import Loading from 'src/client/utils/loading/Loading';
import type { Viewer } from './ViewerContext';
import type { ViewerQuery } from './__generated__/ViewerQuery';

const VIEWER_QUERY = gql`
  query ViewerQuery {
    me {
      _id
      username
      displayName
      crews
    }
  }
`;

export default function useLoadViewer(): Viewer {
  const { data, loading } = useQuery<ViewerQuery>(VIEWER_QUERY);
  const username = data?.me?.username;
  const id = data?.me?._id;
  const displayName = data?.me?.displayName || username;
  const crews = data?.me?.crews ?? [];
  return React.useMemo((): Viewer => {
    if (loading) {
      return {
        crews: Loading,
        displayName: Loading,
        id: Loading,
        username: Loading,
      };
    } else if (username == null || id == null || displayName == null) {
      return {
        crews: undefined,
        displayName: undefined,
        id: undefined,
        username: undefined,
      };
    } else {
      return {
        crews,
        displayName,
        id,
        username,
      };
    }
  }, [username, loading, id, crews]);
}

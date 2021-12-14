import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import Loading from '../utils/loading';
import type { Viewer } from './ViewerContext';
import type { ViewerQuery } from './__generated__/ViewerQuery';

const VIEWER_QUERY = gql`
  query ViewerQuery {
    me {
      username
    }
  }
`;

export default function useLoadViewer(): Viewer {
  const { data, loading } = useQuery<ViewerQuery>(VIEWER_QUERY);
  console.log('data', data, 'loading', loading);
  const username = data?.me?.username;
  return React.useMemo((): Viewer => {
    return { username: loading ? Loading : username ?? undefined };
  }, [username, loading]);
}

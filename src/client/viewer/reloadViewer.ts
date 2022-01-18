import client from 'src/client/graphql/client';

export default function reloadViewer(): void {
  client.refetchQueries({ include: ['ViewerQuery'] });
}

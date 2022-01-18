import client from 'graphql/client';

export default function reloadViewer(): void {
  client.refetchQueries({ include: ['ViewerQuery'] });
}

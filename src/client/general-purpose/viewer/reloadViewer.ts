import client from '../../aid-app/graphql/client';

export default function reloadViewer(): void {
  client.refetchQueries({ include: ['ViewerQuery'] });
}

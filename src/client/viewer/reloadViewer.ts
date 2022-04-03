import client from 'src/client/graphql/client';

export default async function reloadViewer(): Promise<void> {
  await client.refetchQueries({ include: ['ViewerQuery'] });
}

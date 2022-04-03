import client from 'src/client/graphql/client';
import reloadViewer from 'src/client/viewer/reloadViewer';

export default async function resetCache(): Promise<void> {
  await client.cache.reset();
  await client.resetStore();
  await reloadViewer();
}

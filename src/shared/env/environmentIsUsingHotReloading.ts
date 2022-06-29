import env from 'src/shared/env/env';

export default function environmentIsUsingHotReloading(): boolean {
  return env.HOT_RELOAD === 'True';
}

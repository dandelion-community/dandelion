import Bugsnag from '@bugsnag/expo';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import Constants from 'expo-constants';

let initialized = false;

export default function initErrorLogging(): void {
  if (!initialized) {
    Bugsnag.start({
      apiKey: '10aad92a8ec0e1998f3f466ae42fdfc9',
      enabledReleaseStages: ['production'],
      plugins: [new BugsnagPluginReact()],
      releaseStage:
        Constants.manifest?.packagerOpts?.dev === true
          ? 'development'
          : 'production',
    });
  }
  initialized = true;
}

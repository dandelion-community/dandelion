import Bugsnag from '@bugsnag/expo';
import BugsnagPluginReact from '@bugsnag/plugin-react';

let initialized = false;

export default function initErrorLogging(): void {
  if (!initialized) {
    Bugsnag.start({
      apiKey: '10aad92a8ec0e1998f3f466ae42fdfc9',
      plugins: [new BugsnagPluginReact()],
    });
  }
  initialized = true;
}

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

export default function initErrorLogging(): void {
  Bugsnag.start({
    apiKey: '10aad92a8ec0e1998f3f466ae42fdfc9',
    plugins: [new BugsnagPluginReact()],
  });
}

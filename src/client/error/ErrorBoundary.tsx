import Bugsnag from '@bugsnag/expo';
import React from 'react';
import initErrorLogging from 'src/client/error/initErrorLogging';

initErrorLogging();

const BugsnagErrorBoundary =
  Bugsnag.getPlugin('react')?.createErrorBoundary(React);

export default function ErrorBoundary({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return BugsnagErrorBoundary == null ? (
    children
  ) : (
    <BugsnagErrorBoundary>{children}</BugsnagErrorBoundary>
  );
}

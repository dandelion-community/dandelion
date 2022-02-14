import Bugsnag from '@bugsnag/expo';
import React from 'react';

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

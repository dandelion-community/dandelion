import { ApolloError } from '@apollo/client';
import Bugsnag from '@bugsnag/expo';
import React from 'react';
import initErrorLogging from 'src/client/error/initErrorLogging';
import ErrorNotice from '../components/ErrorNotice';

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
    <BugsnagErrorBoundary
      FallbackComponent={({ error, info }) => {
        return (
          <ErrorNotice
            error={new ApolloError({ clientErrors: [error], extraInfo: info })}
            whenTryingToDoWhat="load this module"
          />
        );
      }}
    >
      {children}
    </BugsnagErrorBoundary>
  );
}

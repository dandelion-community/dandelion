import * as React from 'react';
import SmallText from 'src/client/menu/debug/SmallText';

type Props = { request: XMLHttpRequest };

export default function GraphQLResponseSummary({
  request,
}: Props): JSX.Element {
  return (
    <>
      <SmallText>
        Status: {String(request.status)} -{' '}
        {readableSummary(
          request.status,
          request.statusText,
          request.responseText,
        )}
      </SmallText>
    </>
  );
}

function readableSummary(
  status: number,
  statusText: string,
  responseText: string,
): string {
  let parsedResponseText;
  switch (status) {
    case 0:
      return "This might mean there's no server running at that URL.";
    case 200:
      parsedResponseText = JSON.parse(responseText);
      if ('data' in parsedResponseText && 'me' in parsedResponseText.data) {
        if (parsedResponseText.data.me?.username) {
          return `OK response and you're logged in as ${parsedResponseText.data.me?.username}.`;
        } else {
          return "OK response, but you're not logged in, so there might still be cookie issues.";
        }
      } else {
        return (
          "OK response code, but the returned data doesn't look right: " +
          responseText
        );
      }
    default:
      return responseText;
  }
}

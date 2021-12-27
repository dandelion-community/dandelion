import * as React from 'react';
import { View } from 'react-native';
import Loading from '../../../general-purpose/utils/loading';
import usePromise from '../../../general-purpose/utils/usePromise';
import GraphQLErrorSummary from './GraphQLErrorSummary';
import GraphQLResponseSummary from './GraphQLResponseSummary';
import SmallText from './SmallText';

type Props = { host: string };

export default function GraphQLHostDiagnostics({ host }: Props): JSX.Element {
  const queryInfo = usePromise<XMLHttpRequest>(() => getRawFetch(host), [host]);

  return (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderColor: '#777',
        borderWidth: 1,
        marginLeft: 8,
      }}
    >
      <View style={{ margin: 4 }}>
        <SmallText>Diagnostics for {host}</SmallText>
        {queryInfo === Loading ? (
          <SmallText>Loading...</SmallText>
        ) : queryInfo instanceof Error ? (
          <GraphQLErrorSummary error={queryInfo} />
        ) : (
          <GraphQLResponseSummary request={queryInfo} />
        )}
      </View>
    </View>
  );
}

function getRawFetch(host: string): Promise<XMLHttpRequest> {
  const body = JSON.stringify({
    operationName: 'SpotCheckMeQuery',
    query:
      'query SpotCheckMeQuery {\n  me {\n    username\n    __typename\n  }\n}\n',
    variables: {},
  });
  return new Promise((resolve, reject) => {
    try {
      const request = new XMLHttpRequest();
      request.onreadystatechange = (_e: Event) => {
        if (request.readyState !== 4) {
          return;
        }
        resolve(request);
      };
      request.addEventListener('error', (error) => reject(error));
      request.open('POST', host);
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(body);
    } catch (error) {
      reject(error);
    }
  });
}

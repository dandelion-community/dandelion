import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry } from 'react-native';
import {
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DARK_THEME,
  LIGHT_THEME,
} from 'src/client/components/theme/ReactNativePaperTheme';
import ErrorBoundary from 'src/client/error/ErrorBoundary';
import initErrorLogging from 'src/client/error/initErrorLogging';
import GlobalProviders from 'src/client/root/GlobalProviders';
import ViewerProvider from 'src/client/viewer/ViewerProvider';
import client from './graphql/client';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './light-or-dark/useColorScheme';
import Navigation from './navigation/Navigation';

initErrorLogging();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme}>
            <ApolloProvider client={client}>
              <ViewerProvider>
                <GlobalProviders>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />
                </GlobalProviders>
              </ViewerProvider>
            </ApolloProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }
}

AppRegistry.registerComponent('Dandelion Community Aid', () => App);

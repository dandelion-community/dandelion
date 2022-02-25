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
import client from 'src/client/graphql/client';
import useCachedResources from 'src/client/hooks/useCachedResources';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import Navigation from 'src/client/navigation/Navigation';
import RootLevelComponents from 'src/client/root/RootLevelComponents';
import LoadingScreen from '../components/LoadingScreen';

initErrorLogging();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  if (!isLoadingComplete) {
    return <LoadingScreen />;
  } else {
    return (
      <ErrorBoundary>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme}>
            <ApolloProvider client={client}>
              <RootLevelComponents>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </RootLevelComponents>
            </ApolloProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    );
  }
}

AppRegistry.registerComponent('Dandelion Community Aid', () => App);

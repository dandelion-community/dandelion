import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import client from './aid-app/graphql/client';
import Navigation from './aid-app/navigation/Navigation';
import DrawerProvider from './general-purpose/drawer/DrawerProvider';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

const DARK_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    onSurface: '#38956a',
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? DARK_THEME : DefaultTheme;

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <ApolloProvider client={client}>
            <DrawerProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </DrawerProvider>
          </ApolloProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent('Dandelion Community Aid', () => App);

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
import useColorScheme from './general-purpose/components/light-or-dark-themed/useColorScheme';
import DrawerProvider from './general-purpose/drawer/DrawerProvider';
import ToastProvider from './general-purpose/toast/ToastProvider';
import useCachedResources from './hooks/useCachedResources';

const DARK_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    accent: '#a577e7',
    onSurface: '#482d48',
    surface: '#eee',
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
            <ToastProvider>
              <DrawerProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </DrawerProvider>
            </ToastProvider>
          </ApolloProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent('Dandelion Community Aid', () => App);

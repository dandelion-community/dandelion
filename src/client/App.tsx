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
import useColorScheme from './light-or-dark/useColorScheme';
import DialogProvider from './dialog/DialogProvider';
import DrawerProvider from './drawer/DrawerProvider';
import ToastProvider from './toast/ToastProvider';
import client from './graphql/client';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation/Navigation';

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
            <DialogProvider>
              <ToastProvider>
                <DrawerProvider>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />
                </DrawerProvider>
              </ToastProvider>
            </DialogProvider>
          </ApolloProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent('Dandelion Community Aid', () => App);

/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  DarkTheme,
  DefaultTheme,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import Header from 'src/client/components/Header';
import LinkingConfiguration from './LinkingConfiguration';
import type { RootStackParamList } from './NavigationTypes';
import RootNavigationStore from './RootNavigationStore';
import CreateAccountScreen from './screens/create_account/CreateAccountScreen';
import LoginScreen from './screens/login/LoginScreen';
import MainScreen from './screens/main/MainScreen';
import NotFoundScreen from './screens/not_found/NotFoundScreen';
import NotLoggedInScreen from './screens/not_logged_in/NotLoggedInScreen';
import RecordAidRequestScreen from './screens/record_aid_request/RecordAidRequestScreen';

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.light.background },
};

const DARK_THEME = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: Colors.dark.background },
};

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}): JSX.Element {
  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={MainScreen}
        name="Main"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={NotFoundScreen}
        name="NotFound"
        options={{ headerShown: false, title: 'Not Found' }}
      />
      <Stack.Screen
        component={NotLoggedInScreen}
        name="NotLoggedIn"
        options={() => ({
          header: ({ options }) => (
            <Header>
              <Appbar.Content title={options.title} />
            </Header>
          ),
          title: 'Welcome!',
        })}
      />
      <Stack.Screen
        component={CreateAccountScreen}
        name="Create Account"
        options={optionsForHeaderWithBackToMainButton('Sign Up')}
      />
      <Stack.Screen
        component={LoginScreen}
        name="Login"
        options={optionsForHeaderWithBackToMainButton('Log In')}
      />
      <Stack.Screen
        component={RecordAidRequestScreen}
        name="Record Request"
        options={optionsForHeaderWithBackToMainButton('Record Request')}
      />
    </Stack.Navigator>
  );

  function optionsForHeaderWithBackToMainButton(
    title: string,
  ): () => NativeStackNavigationOptions {
    return () => ({
      header: ({ options }: NativeStackHeaderProps) => (
        <Header>
          <Appbar.BackAction onPress={goToMain} />
          <Appbar.Content title={options.title} />
        </Header>
      ),
      title,
    });
  }

  function goToMain(): void {
    const navigation = RootNavigationStore.getValue();
    navigation?.canGoBack()
      ? navigation?.goBack()
      : navigation?.replace('Main');
  }
}

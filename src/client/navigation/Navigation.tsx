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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Appbar } from 'react-native-paper';
import Colors from 'src/client/components/Colors';
import useColorScheme from 'src/client/light-or-dark/useColorScheme';
import useLoadViewer from 'src/client/viewer/useLoadViewer';
import ViewerContext from 'src/client/viewer/ViewerContext';
import LinkingConfiguration from './LinkingConfiguration';
import type {
  RootNavigationAllTypes,
  RootStackParamList,
} from './NavigationTypes';
import RootNavigationContext from './RootNavigationContext';
import CreateAccountScreen from './screens/create_account/CreateAccountScreen';
import LoginScreen from './screens/login/LoginScreen';
import MainScreen from './screens/main/MainScreen';
import NotFoundScreen from './screens/not_found/NotFoundScreen';
import NotLoggedInScreen from './screens/not_logged_in/NotLoggedInScreen';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}): JSX.Element {
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
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
  const [rootNavigation, setRootNavigation] =
    React.useState<RootNavigationAllTypes>(null);
  const viewer = useLoadViewer();
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <ViewerContext.Provider value={viewer}>
      <RootNavigationContext.Provider
        value={{ rootNavigation, setRootNavigation }}
      >
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
                <Appbar.Header
                  style={{ backgroundColor: headerBackgroundColor }}
                >
                  <Appbar.Content title={options.title} />
                </Appbar.Header>
              ),
              title: 'Welcome!',
            })}
          />
          <Stack.Screen
            component={CreateAccountScreen}
            name="Create Account"
            options={() => ({
              header: ({ options }) => (
                <Appbar.Header
                  style={{ backgroundColor: headerBackgroundColor }}
                >
                  <Appbar.BackAction
                    onPress={() =>
                      rootNavigation?.canGoBack()
                        ? rootNavigation.goBack()
                        : rootNavigation?.replace('NotLoggedIn')
                    }
                  />
                  <Appbar.Content title={options.title} />
                </Appbar.Header>
              ),
              title: 'Sign Up',
            })}
          />
          <Stack.Screen
            component={LoginScreen}
            name="Login"
            options={() => ({
              header: ({ options }) => (
                <Appbar.Header
                  style={{ backgroundColor: headerBackgroundColor }}
                >
                  <Appbar.BackAction
                    onPress={() =>
                      rootNavigation?.canGoBack()
                        ? rootNavigation.goBack()
                        : rootNavigation?.replace('NotLoggedIn')
                    }
                  />
                  <Appbar.Content title={options.title} />
                </Appbar.Header>
              ),
              title: 'Log In',
            })}
          />
        </Stack.Navigator>
      </RootNavigationContext.Provider>
    </ViewerContext.Provider>
  );
}

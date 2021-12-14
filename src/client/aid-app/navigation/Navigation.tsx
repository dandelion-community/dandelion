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
import useLoadViewer from '../../general-purpose/viewer/useLoadViewer';
import ViewerContext from '../../general-purpose/viewer/ViewerContext';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import NotLoggedInScreen from '../screens/NotLoggedInScreen';
import LinkingConfiguration from './LinkingConfiguration';
import { RootStackParamList } from './types';

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
  const viewer = useLoadViewer();
  console.log('viewer', viewer);
  return (
    <ViewerContext.Provider value={viewer}>
      <Stack.Navigator>
        <Stack.Screen
          component={MainScreen}
          name="Main"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={NotFoundScreen}
          name="NotFound"
          options={{ title: 'Oops!' }}
        />
        <Stack.Screen component={NotLoggedInScreen} name="NotLoggedIn" />
        <Stack.Screen component={CreateAccountScreen} name="Create Account" />
        <Stack.Screen component={LoginScreen} name="Login" />
      </Stack.Navigator>
    </ViewerContext.Provider>
  );
}

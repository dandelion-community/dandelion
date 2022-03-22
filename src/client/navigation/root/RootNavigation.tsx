import {
  DarkTheme,
  DefaultTheme,
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
import navigateToMain from 'src/client/navigation/helpers/navigateToMain';
import LinkingConfiguration from 'src/client/navigation/LinkingConfiguration';
import type {
  RootStackParamList,
  RootStackScreenProps,
} from 'src/client/navigation/NavigationTypes';
import CreateAccountScreen from 'src/client/navigation/screens/create_account/CreateAccountScreen';
import LoginScreen from 'src/client/navigation/screens/login/LoginScreen';
import MainScreen from 'src/client/navigation/screens/main/MainScreen';
import NotFoundScreen from 'src/client/navigation/screens/not_found/NotFoundScreen';
import NotLoggedInScreen from 'src/client/navigation/screens/not_logged_in/NotLoggedInScreen';
import CreationTypeSelectionScreen from '../screens/creation_type_selection_screen/CreationTypeSelectionScreen';
import RecordAidRequestScreen from '../screens/record_aid_request/RecordAidRequestScreen';
import RecordMultiPersonRequestScreen from '../screens/record_multi_person_request/RecordMultiPersonRequestScreen';
import RecordMultiPersonRequestScreenPart2 from '../screens/record_multi_person_request/RecordMultiPersonRequestScreenPart2';
import ResetPasswordScreen from '../screens/reset_password/ResetPasswordScreen';
import RootNavigationStore from './RootNavigationStore';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={wrapComponent(MainScreen)}
        name="Main"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={wrapComponent(NotFoundScreen)}
        name="NotFound"
        options={{ headerShown: false, title: 'Not Found' }}
      />
      <Stack.Screen
        component={wrapComponent(NotLoggedInScreen)}
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
        component={wrapComponent(CreateAccountScreen)}
        name="Create Account"
        options={optionsForHeaderWithBackToMainButton('Sign Up')}
      />
      <Stack.Screen
        component={wrapComponent(LoginScreen)}
        name="Login"
        options={optionsForHeaderWithBackToMainButton('Log In')}
      />
      <Stack.Screen
        component={wrapComponent(ResetPasswordScreen)}
        name="ResetPassword"
        options={optionsForHeaderWithBackToMainButton('Reset Password')}
      />
      <Stack.Screen
        component={wrapComponent(CreationTypeSelectionScreen)}
        name="CreationTypeSelection"
        options={optionsForHeaderWithBackToMainButton('Creation Selection')}
      />
      <Stack.Screen
        component={wrapComponent(RecordAidRequestScreen)}
        name="Record Request"
        options={optionsForHeaderWithBackToMainButton('Record Request')}
      />
      <Stack.Screen
        component={wrapComponent(RecordMultiPersonRequestScreen)}
        name="Record Multi Person Request"
        options={optionsForHeaderWithBackToMainButton('Multi Person')}
      />
      <Stack.Screen
        component={wrapComponent(RecordMultiPersonRequestScreenPart2)}
        name="Record Multi Person Request Part 2"
        options={optionsForHeaderWithBackToMainButton('Multi Person')}
      />
    </Stack.Navigator>
  );

  function optionsForHeaderWithBackToMainButton(
    title: string,
  ): () => NativeStackNavigationOptions {
    return () => ({
      header: ({ options }: NativeStackHeaderProps) => (
        <Header>
          <Appbar.BackAction onPress={navigateToMain} />
          <Appbar.Content title={options.title} />
        </Header>
      ),
      title,
    });
  }

  function wrapComponent<T extends keyof RootStackParamList>(
    Component: (props: RootStackScreenProps<T>) => JSX.Element,
  ): (props: RootStackScreenProps<T>) => JSX.Element {
    return React.useCallback((props: RootStackScreenProps<T>) => {
      const { navigation } = props;
      React.useEffect(() => {
        RootNavigationStore.update(navigation);
      }, [navigation]);
      return <Component {...props} />;
    }, []);
  }
}

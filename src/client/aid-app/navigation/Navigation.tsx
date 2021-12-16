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
import type {
  RootStackParamList,
  RootStackScreenProps,
} from './NavigationTypes';

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
            options={{ title: 'Oops!' }}
          />
          <Stack.Screen component={NotLoggedInScreen} name="NotLoggedIn" />
          <Stack.Screen component={CreateAccountScreen} name="Create Account" />
          <Stack.Screen component={LoginScreen} name="Login" />
        </Stack.Navigator>
      </RootNavigationContext.Provider>
    </ViewerContext.Provider>
  );
}

type RootNavigationTypeParameterized<T extends keyof RootStackParamList> =
  RootStackScreenProps<T>['navigation'];

// Idk how else to do this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RootNavigationAllTypes = null | RootNavigationTypeParameterized<any>;

type RootNavigationContextType = {
  rootNavigation: RootNavigationAllTypes;
  setRootNavigation: <T extends keyof RootStackParamList>(
    navigation: RootNavigationTypeParameterized<T>,
  ) => void;
};

export const RootNavigationContext =
  React.createContext<RootNavigationContextType | null>(null);

export function useRootNavigatorContext(): RootNavigationContextType {
  const value = React.useContext(RootNavigationContext);
  if (value == null) {
    throw new Error(
      'useRootNavigatorContext can only be used in descendants of Navigation.tsx',
    );
  }
  return value;
}

export function useRootNavigation(): NonNullable<RootNavigationAllTypes> {
  const { rootNavigation } = useRootNavigatorContext();
  if (rootNavigation == null) {
    throw new Error(
      'Each direct child screen of Navigation.tsx must call useSetRootNavigation(navigation);',
    );
  }
  return rootNavigation;
}

export function useSetRootNavigation(
  navigation: NonNullable<RootNavigationAllTypes>,
): void {
  const { setRootNavigation } = useRootNavigatorContext();
  React.useEffect(() => {
    setRootNavigation(navigation);
  }, [setRootNavigation, navigation]);
}

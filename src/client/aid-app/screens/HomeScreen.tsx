import type {
  NativeStackHeaderProps,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  // eslint-disable-next-line prettier/prettier
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import {
  HomeStackParamList,
  HomeStackScreenProps,
  // prettier expects a comma but "editor.codeActionsOnSave": { "source.organizeImports": true } removes the comma
  RootTabScreenProps,
} from '../navigation/types';
import CreateRequestScreen from './CreateRequestScreen';
import HomeRootScreen from './HomeRootScreen';
import PersonDetailsScreen from './PersonDetailsScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export type ExtraProps = { navigateToProfile: () => void };

export default function HomeScreen({
  navigation: parentNavigation,
}: RootTabScreenProps<'Home'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  const extraProps: ExtraProps = React.useMemo(
    () => ({
      navigateToProfile: () => parentNavigation.navigate('Profile'),
    }),
    [],
  );
  const HomeRootScreenWithExtraProps = React.useCallback(
    (_props: HomeStackScreenProps<'HomeRoot'>): JSX.Element => (
      <HomeRootScreen />
    ),
    [extraProps],
  );
  const PersonDetailsScreenProps = React.useCallback(
    (_props: HomeStackScreenProps<'PersonDetails'>): JSX.Element => (
      <PersonDetailsScreen />
    ),
    [extraProps],
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={HomeRootScreenWithExtraProps}
        name="HomeRoot"
        options={({
          navigation: _navigation,
        }: HomeStackScreenProps<'HomeRoot'>) => ({
          header: () => (
            <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
              <Appbar.Content title="Home" />
            </Appbar.Header>
          ),
        })}
      />
      <Stack.Screen
        component={CreateRequestScreen}
        name="CreateRequest"
        options={() => ({
          header: headerWithBackToHome,
          title: 'Create Request',
        })}
      />
      <Stack.Screen
        component={PersonDetailsScreenProps}
        name="PersonDetails"
        options={() => ({
          header: headerWithBackToHome,
          title: '',
        })}
      />
    </Stack.Navigator>
  );

  function headerWithBackToHome<RouteName extends keyof HomeStackParamList>({
    navigation,
    options,
  }: NativeStackHeaderProps): React.ReactNode {
    return (
      <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
        {backToHomeAction(
          navigation as NativeStackNavigationProp<
            HomeStackParamList,
            RouteName
          >,
        )}
        <Appbar.Content title={options.title} />
      </Appbar.Header>
    );
  }
}

function backToHomeAction<RouteName extends keyof HomeStackParamList>(
  navigation: NativeStackNavigationProp<HomeStackParamList, RouteName>,
): JSX.Element {
  return (
    <Appbar.BackAction
      onPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.replace('HomeRoot')
      }
    />
  );
}

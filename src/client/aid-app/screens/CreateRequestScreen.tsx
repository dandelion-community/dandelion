import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import type { RootTabScreenProps } from '../navigation/NavigationTypes';
import { CreateRequestStackParamList } from '../navigation/NavigationTypes';
import CreateRequestRootScreen from './CreateRequestRootScreen';

const Stack = createNativeStackNavigator<CreateRequestStackParamList>();

export default function CreateRequestScreen({
  navigation: _parentNavigation,
}: RootTabScreenProps<'CreateRequest'>): JSX.Element {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = Colors[colorScheme].tabBarBackground;
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={CreateRequestRootScreen}
        name="CreateRequestRoot"
        options={() => ({
          header: ({ options }) => (
            <Appbar.Header style={{ backgroundColor: headerBackgroundColor }}>
              <Appbar.Content title={options.title} />
            </Appbar.Header>
          ),
          title: 'Create Request',
        })}
      />
    </Stack.Navigator>
  );
}

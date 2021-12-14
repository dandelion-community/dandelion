import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import { RootTabParamList, RootTabScreenProps } from '../navigation/types';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

export default function MainScreen(): React.ReactElement {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      activeColor={Colors[colorScheme].tabIconSelected}
      barStyle={{ backgroundColor: Colors[colorScheme].tabBarBackground }}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      initialRouteName="Home"
      shifting={true}
    >
      <BottomTab.Screen
        component={HomeScreen}
        name="Home"
        options={({ navigation: _navigation }: RootTabScreenProps<'Home'>) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="home" />
          ),
          title: 'Home',
        })}
      />
      <BottomTab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="user" />
          ),
          title: 'Profile',
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={props.focused ? 27 : 23}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

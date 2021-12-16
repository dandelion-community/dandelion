import { FontAwesome } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';
import Colors from '../../general-purpose/components/light-or-dark-themed/Colors';
import useColorScheme from '../../general-purpose/components/light-or-dark-themed/useColorScheme';
import { useSetRootNavigation } from '../navigation/Navigation';
import {
  RootStackScreenProps,
  RootTabParamList,
  RootTabScreenProps,
} from '../navigation/NavigationTypes';
import RequestExplorerScreen from './RequestExplorerScreen';
import ThreeLinesMenuScreen from './ThreeLinesMenuScreen';

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

export let setInitialTab: undefined | ((tab: keyof RootTabParamList) => void) =
  undefined;

export default function MainScreen({
  navigation,
}: RootStackScreenProps<'Main'>): React.ReactElement {
  const colorScheme = useColorScheme();
  useSetRootNavigation(navigation);
  const [initialTab, setInitialTab_] =
    React.useState<keyof RootTabParamList>('RequestExplorer');
  React.useEffect(() => {
    setInitialTab = setInitialTab_;
  }, [setInitialTab_]);
  return (
    <BottomTab.Navigator
      activeColor={Colors[colorScheme].tabIconSelected}
      barStyle={{ backgroundColor: Colors[colorScheme].tabBarBackground }}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      initialRouteName={initialTab}
      shifting={true}
    >
      <BottomTab.Screen
        component={RequestExplorerScreen}
        name="RequestExplorer"
        options={({
          navigation: _navigation,
        }: RootTabScreenProps<'RequestExplorer'>) => ({
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="handshake-o" />
          ),
          title: 'All Requests',
        })}
      />
      <BottomTab.Screen
        component={ThreeLinesMenuScreen}
        name="ThreeLinesMenu"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon color={color} focused={focused} name="bars" />
          ),
          title: 'Menu',
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

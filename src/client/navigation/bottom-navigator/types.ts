/**
 * This file is copied from react-native-paper
 * https://github.com/callstack/react-native-paper/blob/main/src/types.tsx
 * 
 * I know forking is a thing but I don't really know how to do it and don't want to slow myself down by learning :p
 * 
 * react-native-paper's license is as follows:
 * 
MIT License
Copyright (c) 2017 Callstack
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

import type {
  Descriptor,
  NavigationHelpers,
  NavigationProp,
  ParamListBase,
  RouteProp,
  TabActionHelpers,
  TabNavigationState,
} from '@react-navigation/native';
import type { BottomNavigation } from 'react-native-paper';

export type MaterialBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: { data: undefined; canPreventDefault: true };
};

export type MaterialBottomTabNavigationHelpers = NavigationHelpers<
  ParamListBase,
  MaterialBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamListBase>;

export type MaterialBottomTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState<ParamList>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type MaterialBottomTabScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = {
  navigation: MaterialBottomTabNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export type MaterialBottomTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Color of the tab bar when this tab is active. Only used when `shifting` is `true`.
   */
  tabBarColor?: string;

  /**
   * Label text of the tab displayed in the navigation bar. When undefined, scene title is used.
   */
  tabBarLabel?: string;

  /**
   * String referring to an icon in the `MaterialCommunityIcons` set, or a
   * function that given { focused: boolean, color: string } returns a React.Node to display in the navigation bar.
   */
  tabBarIcon?:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);

  /**
   * Badge to show on the tab icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  tabBarBadge?: boolean | number | string;

  /**
   * Accessibility label for the tab button. This is read by the screen reader when the user taps the tab.
   */
  tabBarAccessibilityLabel?: string;

  /**
   * ID to locate this tab button in tests.
   */
  tabBarTestID?: string;
};

export type MaterialBottomTabDescriptor = Descriptor<
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type MaterialBottomTabDescriptorMap = Record<
  string,
  MaterialBottomTabDescriptor
>;

export type MaterialBottomTabNavigationConfig = Partial<
  Omit<
    React.ComponentProps<typeof BottomNavigation>,
    | 'navigationState'
    | 'onIndexChange'
    | 'onTabPress'
    | 'renderScene'
    | 'renderLabel'
    | 'renderIcon'
    | 'getAccessibilityLabel'
    | 'getBadge'
    | 'getColor'
    | 'getLabelText'
    | 'getTestID'
  >
>;

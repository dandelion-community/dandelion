/**
 * This file is mostly copied from react-navigation
 * https://github.com/react-navigation/react-navigation/blob/main/packages/material-bottom-tabs/src/navigators/createMaterialBottomTabNavigator.tsx
 * 
 * Meaningfully modified portions are enclosed with // {MODIFIED} and // {END MODIFIED}
 * 
 * I know forking is a thing but I don't really know how to do it and don't want to slow myself down by learning :p
 * 
 * react-navigation/material-bottom-tabs's license is as follows:
 * https://github.com/react-navigation/react-navigation/blob/main/packages/material-bottom-tabs/LICENSE
 * 
 * 
MIT License

Copyright (c) 2017 React Navigation Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import type { MaterialBottomTabNavigationOptions } from '@react-navigation/material-bottom-tabs';
import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  ParamListBase,
  TabActionHelpers,
  TabNavigationState,
  TabRouter,
  TabRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import type { BottomNavigation } from 'react-native-paper';
import MaterialBottomTabView from './MaterialBottomTabView';

type MaterialBottomTabNavigationEventMap = {
  /**
   * Event which fires on tapping on the tab in the tab bar.
   */
  tabPress: {
    data: undefined;
    canPreventDefault: true;
  };
};

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

// {MODIFIED}
type ExtraProps = {
  onFABPress: () => void;
};
// {END MODIFIED}

type Props = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap
> &
  TabRouterOptions &
  MaterialBottomTabNavigationConfig &
  // {MODIFIED}
  ExtraProps;
// {END MODIFIED}

function MaterialBottomTabNavigator({
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      MaterialBottomTabNavigationOptions,
      MaterialBottomTabNavigationEventMap
    >(TabRouter, {
      backBehavior,
      children,
      initialRouteName,
      screenListeners,
      screenOptions,
    });

  return (
    <NavigationContent>
      <MaterialBottomTabView
        {...rest}
        descriptors={descriptors}
        navigation={navigation}
        state={state}
      />
    </NavigationContent>
  );
}

export default createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  MaterialBottomTabNavigationOptions,
  MaterialBottomTabNavigationEventMap,
  typeof MaterialBottomTabNavigator
>(MaterialBottomTabNavigator);

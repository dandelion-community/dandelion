/**
 * This file is copied from react-native-paper
 * https://github.com/callstack/react-native-paper/blob/main/src/components/BottomNavigation/BottomNavigationRouteScreen.tsx
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

import React from 'react';
import { Animated, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  visibility?: 0 | 1 | Animated.AnimatedInterpolation;
  index: number;
}

class BottomNavigationRouteScreen extends React.Component<Props> {
  render(): JSX.Element {
    const { style, index, children, visibility, ...rest } = this.props;

    const display = visibility === 0 ? 'none' : 'flex';

    return (
      <View
        style={[style, { display }]}
        testID={`RouteScreen: ${index}`}
        {...rest}
      >
        {children}
      </View>
    );
  }
}

export default Animated.createAnimatedComponent(BottomNavigationRouteScreen);

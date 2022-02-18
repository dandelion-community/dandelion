import { DarkTheme, DefaultTheme } from 'react-native-paper';
import Colors from 'src/client/components/Colors';

export const DARK_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    accent: '#633B48',
    background: Colors.dark.background,
    onSurface: '#482d48',
    surface: '#eee',
  },
};

export const LIGHT_THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    accent: '#FFD8E4',
    background: Colors.light.background,
  },
};

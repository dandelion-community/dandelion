import useColorScheme from 'src/client/light-or-dark/useColorScheme';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const Colors = {
  dark: {
    background: '#181818',
    cardBackground: '#282828',
    placeholderText: 'rgba(255,255,255,0.6)',
    tabBarBackground: '#250056',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    text: '#fff',
    tint: tintColorDark,
  },
  light: {
    background: '#fff',
    cardBackground: '#f8f8f8',
    placeholderText: 'rgba(0,0,0,0.6)',
    tabBarBackground: '#6200ee',
    tabIconDefault: '#ccc',
    tabIconSelected: '#f7ff7e',
    text: '#000',
    tint: tintColorLight,
  },
};

export default Colors;

export function useColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
): string {
  const theme = useColorScheme();
  return Colors[theme][colorName];
}

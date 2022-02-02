import useColorScheme from 'src/client/light-or-dark/useColorScheme';

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const Colors = {
  dark: {
    accent: '#bb86fc',
    background: '#181818',
    cardBackground: '#282828',
    divider: 'rgba(255,255,255,0.15)',
    draftCardColor: '#ffffd0',
    m3buttonBackground: '#4A4458', // M3/sys/dark/secondary-container
    m3buttonText: '#E8DEF8', // M3/sys/dark/on-secondary-container
    placeholderText: 'rgba(255,255,255,0.6)',
    tabBarBackground: '#250056',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    text: '#fff',
    tint: tintColorDark,
  },
  light: {
    accent: '#bb86fc',
    background: '#fff',
    cardBackground: '#f8f8f8',
    divider: 'rgba(0,0,0,0.15)',
    draftCardColor: '#ffffd0',
    m3buttonBackground: '#E8DEF8', // M3/sys/dark/secondary-container
    m3buttonText: '#1D192B', // M3/sys/light/on-secondary-container
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

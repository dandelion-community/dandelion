import useColorScheme from 'src/client/light-or-dark/useColorScheme';

const Colors = {
  dark: {
    accent: '#633B48',
    background: '#181818',
    cardBackground: '#181818',
    divider: 'rgba(255,255,255,0.15)',
    draftCardColor: '#46461c',
    errorButtonBackground: '#542828',
    errorNoticeBorder: '#542820',
    m3buttonBackground: '#4A4458', // M3/sys/dark/secondary-container
    m3buttonText: '#E8DEF8', // M3/sys/dark/on-secondary-container
    placeholderText: 'rgba(255,255,255,0.6)',
    pressableText: '#a577e7',
    tabBarBackground: '#1C1B1F',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
    text: '#fff',
    tint: '#fff',
  },
  light: {
    accent: '#FFD8E4',
    background: '#fff',
    cardBackground: '#fff',
    divider: 'rgba(0,0,0,0.15)',
    draftCardColor: '#ffffd0',
    errorButtonBackground: '#ffb5b5',
    errorNoticeBorder: '#ffb5b5',
    m3buttonBackground: '#E8DEF8', // M3/sys/dark/secondary-container
    m3buttonText: '#1D192B', // M3/sys/light/on-secondary-container
    placeholderText: 'rgba(0,0,0,0.6)',
    pressableText: '#6200EE',
    tabBarBackground: '#E8DEF8',
    tabIconDefault: '#1D192B',
    tabIconSelected: '#1D192B',
    text: '#000',
    tint: '#2f95dc',
  },
};

export default Colors;

export function useColor(
  arg:
    | (keyof typeof Colors.light & keyof typeof Colors.dark)
    | { light: string; dark: string },
): string {
  const theme = useColorScheme();
  if (typeof arg === 'string') {
    return Colors[theme][arg];
  } else {
    return arg[theme];
  }
}

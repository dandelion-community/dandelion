import RootNavigationStore from 'src/client/navigation/RootNavigationStore';

export default function navigateToMain(): void {
  const navigation = RootNavigationStore.getValue();
  navigation?.canGoBack() ? navigation?.goBack() : navigation?.replace('Main');
}

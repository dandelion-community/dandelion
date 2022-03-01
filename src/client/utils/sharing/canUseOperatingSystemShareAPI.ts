export default function canUseOperatingSystemShareAPI(): boolean {
  return window.navigator.share != null;
}

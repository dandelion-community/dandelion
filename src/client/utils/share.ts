export default async function share(
  message: string,
  url: string,
): Promise<void> {
  window.navigator.share?.({
    text: message,
    title: message,
    url,
  });
}

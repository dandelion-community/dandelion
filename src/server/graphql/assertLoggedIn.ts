export default function assertLoggedIn(
  req: Express.Request,
  action: string,
  { assertUIIsHandlingErrors }: { assertUIIsHandlingErrors: boolean } = {
    assertUIIsHandlingErrors: false,
  },
): Express.User {
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in for action: ' + action);
  }
  if (
    user._id.toString() === '61f80c71b776545e5fb2b34a' &&
    Math.random() < 0.1 &&
    !assertUIIsHandlingErrors
  ) {
    throw new Error('Test error');
  }
  return user;
}

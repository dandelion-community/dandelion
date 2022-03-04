export default function assertLoggedIn(
  req: Express.Request,
  action: string,
): Express.User {
  const { user } = req;
  if (user == null) {
    throw new Error('You must be logged in for action: ' + action);
  }
  return user;
}

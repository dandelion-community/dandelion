import type { ObjectId } from 'mongodb';
import { UserModel } from 'src/server/collections/user/UserModel';
import filterNulls from 'src/shared/utils/filterNulls';

export default async function loadUserForViewer(
  viewer: Express.User,
  otherUserID: string | undefined,
): Promise<Express.User> {
  const aidRequest = await maybeLoadUserForViewer(viewer, otherUserID);
  if (aidRequest == null) {
    console.log('Tried to load user: ' + JSON.stringify(otherUserID));
    throw new Error(
      'No request found for this ID or You do not have permission to view this user',
    );
  }
  return aidRequest;
}

export async function maybeLoadMany(
  viewer: Express.User,
  otherUserIDs_: Array<ObjectId | string | undefined>,
): Promise<Array<Express.User>> {
  const otherUserIDs: Array<string> = [];
  otherUserIDs_.forEach((maybeID: ObjectId | string | undefined): void => {
    if (maybeID != null) {
      otherUserIDs.push(maybeID.toString());
    }
  });
  const lookedUp = await Promise.all(
    otherUserIDs.map((otherUserID) =>
      maybeLoadUserForViewer(viewer, otherUserID),
    ),
  );
  return filterNulls(lookedUp);
}

export async function maybeLoadUserForViewer(
  viewer: Express.User,
  otherUserID: string | undefined,
): Promise<Express.User | null> {
  const otherUser = await UserModel.findById(otherUserID);
  if (otherUser == null) {
    return null;
  }
  if (!viewerCanSeeUser(viewer, otherUser)) {
    return null;
  }
  return otherUser;
}

export function viewerCanSeeUser(
  viewer: Express.User,
  otherUser: Express.User,
): boolean {
  return viewer.crews.some((crew) => otherUser.crews.includes(crew));
}

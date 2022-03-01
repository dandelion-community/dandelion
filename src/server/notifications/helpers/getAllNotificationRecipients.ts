import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import getHistoryWithoutRemovals from 'src/server/collections/aid_request/helpers/getHistoryWithoutRemovals';
import { viewerCanSeeUser } from 'src/server/collections/user/loader/loadUserForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import filterNulls from 'src/shared/utils/filterNulls';
import uniques from 'src/shared/utils/uniques';

export default async function getAllNotificationRecipients({
  actor,
  aidRequest,
}: {
  actor: Express.User;
  aidRequest: AidRequest;
}): Promise<Array<Express.User>> {
  const potentialRecipients = await getAllPotentialRecipients(aidRequest);
  const recipients = potentialRecipients.filter((recipient) => {
    // Don't notify the actor about their own actions
    if (recipient._id.equals(actor._id)) {
      return false;
    }
    // Check whether the potential recipient (the person who would
    // be the "viewer" of the notification) can see the actor
    // (the person who would be the subject of the notification)
    return viewerCanSeeUser(recipient, actor);
  });
  return recipients;
}

async function getAllPotentialRecipients(
  aidRequest: AidRequest,
): Promise<Array<Express.User>> {
  const history = getHistoryWithoutRemovals(aidRequest);
  const userIDs = uniques(history.map(({ actor }) => actor.toString()));
  const users = await Promise.all(
    userIDs.map((userID: string) => UserModel.findById(userID)),
  );
  return filterNulls(users);
}

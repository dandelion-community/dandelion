import type { AidRequest } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestHistoryEventType } from 'src/server/collections/aid_request/AidRequestModelTypes';
import getHistoryWithoutRemovals from 'src/server/collections/aid_request/helpers/getHistoryWithoutRemovals';
import { viewerCanSeeUser } from 'src/server/collections/user/loader/loadUserForViewer';
import { UserModel } from 'src/server/collections/user/UserModel';
import notifyOneListenerAboutAidRequestUpdate from 'src/server/notifications/notifyOneListenerAboutAidRequestUpdate';
import filterNulls from 'src/shared/utils/filterNulls';

type Args = {
  actor: Express.User;
  aidRequest: AidRequest;
  verb: string;
  content: string;
};

export default async function notifyListenersAboutAidRequestUpdate({
  actor,
  aidRequest,
  verb,
  content,
}: Args): Promise<void> {
  const potentialSubscribers = await getAllPotentialSubscribers(aidRequest);
  const subscribers = potentialSubscribers.filter(({ user }) => {
    // Don't notify the actor about their own actions
    if (user._id.equals(actor._id)) {
      return false;
    }
    // Check whether the potential subscriber (the person who would
    // be the "viewer" of the notification) can see the actor
    // (the person who would be the subject of the notification)
    if (!viewerCanSeeUser(user, actor)) {
      return false;
    }
    return true;
  });
  const subjectContent =
    content +
    '\n\n' +
    'https://app.dandelion.supplies/r?id=' +
    aidRequest._id.toString();
  await Promise.all(
    subscribers.map(async ({ user, why }) => {
      await notifyOneListenerAboutAidRequestUpdate({
        recipient: user,
        recipientReason: why,
        subjectAction: verb,
        subjectContent,
        subjectUser: actor,
      });
    }),
  );
}

type PotentialSubscriber = {
  user: Express.User;
  why: string;
};

async function getAllPotentialSubscribers(
  aidRequest: AidRequest,
): Promise<Array<PotentialSubscriber>> {
  const history = getHistoryWithoutRemovals(aidRequest);
  const reasonsByUserId = new Map<string, Array<AidRequestHistoryEventType>>();
  history.forEach(({ event, actor }) => {
    const userID = actor.toString();
    const reasons: Array<AidRequestHistoryEventType> =
      reasonsByUserId.get(userID) ?? [];
    reasons.push(event);
    reasonsByUserId.set(userID, reasons);
  });
  const usersAndReasonsPromises: Array<
    () => Promise<PotentialSubscriber | null>
  > = [];
  reasonsByUserId.forEach(
    (reasons: Array<AidRequestHistoryEventType>, userId: string): void => {
      usersAndReasonsPromises.push(async () => {
        const user = await UserModel.findById(userId);
        if (user == null) {
          return null;
        }
        const summarizedReasons = summarizeReasons(reasons);
        return {
          user,
          why: summarizedReasons,
        };
      });
    },
  );
  const usersAndReasons = await Promise.all(
    usersAndReasonsPromises.map((getPromise) => getPromise()),
  );
  return filterNulls(usersAndReasons);
}

function summarizeReasons(reasons: Array<AidRequestHistoryEventType>): string {
  const texts = reasons.map(getStatusText);
  switch (texts.length) {
    case 0:
      throw new Error('summarizeReasons expects at least 1 reason');
    case 1:
      return texts[0];
    case 2:
      return `${texts[0]} and ${texts[1]}`;
    default:
      return (() => {
        const head = texts.slice(0, -1);
        const tail = texts[texts.length - 1];
        return `${head.join(', ')}, and ${tail}`;
      })();
  }
}

function getStatusText(event: AidRequestHistoryEventType): string {
  // Alice commented on a request you <<...>>
  switch (event) {
    case 'WorkingOn':
      return 'are working on';
    case 'Completed':
      return 'completed';
    case 'Created':
      return 'created';
    case 'Deleted':
      return 'deleted';
    case 'Comment':
      return 'commented on';
  }
}

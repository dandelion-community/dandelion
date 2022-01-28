import { PipelineStage } from 'mongoose';
import type { Filter } from 'src/server/collections/aid_request/query_fields/allAidRequests/helpers/types';

export default function getIAmWorkingOnItFilter(
  user: Express.User,
  filter: Filter,
): PipelineStage[] {
  const { iAmWorkingOnIt } = filter;
  if (iAmWorkingOnIt == null) {
    return [];
  }
  return [
    // // JS analogue of the following MongoDB aggregation:
    // Stage 1:
    // foreach (aidRequest in aidRequests) {
    //   aidRequest.iAmWorkingOnIt = 1 === size(
    //     setIntersection(
    //       viewerID,
    //       aidRequest.whoIsWorkingOnIt,
    //     )
    //   ) ? 1 : 0;
    // }
    // Stage 2:
    // aidRequests = aidRequests.filter(
    //   req => req.iAmWorkingOnIt === (iAmWorkingOnIt ? 1 : 0)
    // );
    {
      $addFields: {
        iAmWorkingOnIt: {
          $cond: [
            {
              $eq: [
                1,
                {
                  $size: {
                    $setIntersection: [
                      [user._id.toString()],
                      '$whoIsWorkingOnIt',
                    ],
                  },
                },
              ],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $match: {
        iAmWorkingOnIt: iAmWorkingOnIt ? 1 : 0,
      },
    },
  ];
}

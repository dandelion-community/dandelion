import { PipelineStage } from 'mongoose';

export default function getCrewFilter(user: Express.User): PipelineStage[] {
  return [
    // // JS analogue of the following MongoDB aggregation:
    // Stage 1:
    // foreach (aidRequest in aidRequests) {
    //   aidRequest.isInOneOfMyCrews = 1 === size(
    //     setIntersection(
    //       user.crews,
    //       aidRequest.crew,
    //     )
    //   ) ? 1 : 0;
    // }
    // Stage 2:
    // aidRequests = aidRequests.filter(
    //   req => req.isInOneOfMyCrews === 1
    // );
    {
      $addFields: {
        isInOneOfMyCrews: {
          $cond: [
            {
              $eq: [
                1,
                {
                  $size: {
                    $setIntersection: [user.crews, ['$crew']],
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
        isInOneOfMyCrews: 1,
      },
    },
  ];
}

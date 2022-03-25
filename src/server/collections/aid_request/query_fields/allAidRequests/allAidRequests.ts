import dotenv from 'dotenv';
import { PipelineStage } from 'mongoose';
import analytics from 'src/server/analytics';
import type { AidRequestConnectionType } from 'src/server/collections/aid_request/AidRequestGraphQLTypes';
import { AidRequestModel } from 'src/server/collections/aid_request/AidRequestModel';
import type { Filter } from 'src/server/collections/aid_request/query_fields/allAidRequests/helpers/types';
import assertLoggedIn from 'src/server/graphql/assertLoggedIn';
import filterNulls from 'src/shared/utils/filterNulls';
import {
  AidRequest,
  AidRequestFilterInputType,
  AidRequestGraphQLType,
} from '../../AidRequestGraphQLTypes';
import getCompletedFilter from './helpers/getCompletedFilter';
import getCrewFilter from './helpers/getCrewFilter';
import getIAmWorkingOnItFilter from './helpers/getIAmWorkingOnItFilter';
import getSearchFilter from './helpers/getSearchFilter';

dotenv.config();

type Args = {
  filter: Filter;
  after: string | null | undefined;
  first: number;
};

const aidRequests = AidRequestGraphQLType.schemaComposer.createResolver<
  Express.User,
  Args
>({
  args: {
    after: 'String',
    filter: AidRequestFilterInputType,
    first: 'Int',
  },
  kind: 'query',
  name: 'aidRequests',
  resolve: async ({
    args,
    context: request,
  }): Promise<AidRequestConnectionType> => {
    const user = assertLoggedIn(request, 'aidRequests', {
      assertUIIsHandlingErrors: true,
    });
    const { after, first, filter } = args;
    const $skip = Math.max(0, parseInt(after || '0'));
    const $limit = first;

    analytics.track({
      event: 'Loaded Aid Requests',
      properties: {
        isCompletedFilter: filter?.completed === true ? 'true' : 'false',
        isFirstPage: after == null ? 'true' : 'false',
        isMeFilter: filter?.iAmWorkingOnIt ? 'true' : 'false',
        search: args.filter?.search || '',
      },
      user,
    });

    const filters: Array<PipelineStage> = filterNulls([
      getSearchFilter(filter),
      getCompletedFilter(filter),
      ...getIAmWorkingOnItFilter(user, filter),
      ...getCrewFilter(user),
    ]);
    const query = AidRequestModel.aggregate<{
      data: AidRequest[];
      total: number;
    }>([
      ...filters,
      {
        $sort: {
          lastUpdated: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip }, { $limit }],
          metadata: [{ $count: 'total' }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $arrayElemAt: ['$metadata.total', 0] },
        },
      },
    ]);
    const [result] = await query;
    const { data, total } = result;
    const nextSkip = $skip + data.length;
    const hasMore = total > nextSkip;

    return {
      edges: data.map((node: AidRequest) => ({ node })),
      pageInfo: {
        endCursor: String(nextSkip),
        hasNextPage: hasMore,
      },
    };
  },
  type: 'AidRequestConnection!',
});

export default aidRequests;

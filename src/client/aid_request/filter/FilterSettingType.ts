import { FilterContext } from 'src/client/aid_request/filter/FilterContext';
import type { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import { ListOfAidRequestsQuery_allAidRequests_edges_node } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';

export type UpdateFilter = (
  oldFilter: FilterType,
  context: FilterContext,
) => FilterType;

export type DecodeReducerArgs = {
  filter: FilterType;
  encoded: string;
};

export type FilterSettingType = {
  decode: (args: DecodeReducerArgs) => DecodeReducerArgs;
  encode: (filter: FilterType) => string;
  getCurrentToggleState: (
    filter: FilterType,
    context: FilterContext,
  ) => boolean;
  label: string;
  passes: (
    filter: FilterType,
    aidRequest: ListOfAidRequestsQuery_allAidRequests_edges_node,
    context: FilterContext,
  ) => boolean;
  toggleOff: UpdateFilter;
  toggleOn: UpdateFilter;
};

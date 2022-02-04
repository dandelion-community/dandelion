import type { FilterType } from 'src/client/request_explorer/RequestExplorerFiltersContext';
import { FilterContext } from '../../request_explorer/FilterContext';
import { ListOfAidRequestsQuery } from '../../request_explorer/__generated__/ListOfAidRequestsQuery';

export type SubscriberKey = {
  filter: FilterType;
  filterContext: FilterContext;
};

export type SubscriberValue = {
  data: ListOfAidRequestsQuery;
  filter: FilterType;
  filterContext: FilterContext;
};

const SUBSCRIBERS: Map<string, SubscriberValue> = new Map();

function add({ data, filter, filterContext }: SubscriberValue): void {
  const serializedKey = JSON.stringify({ filter, filterContext });
  SUBSCRIBERS.set(serializedKey, { data, filter, filterContext });
}

function forEach(cb: (value: SubscriberValue) => void): void {
  SUBSCRIBERS.forEach(cb);
}

export default {
  add,
  forEach,
};

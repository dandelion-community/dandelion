import { FilterContext } from 'src/client/aid_request/filter/FilterContext';
import { FilterType } from 'src/client/aid_request/filter/RequestExplorerFiltersStore';
import { ListOfAidRequestsQuery } from 'src/client/aid_request/list/__generated__/ListOfAidRequestsQuery';

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

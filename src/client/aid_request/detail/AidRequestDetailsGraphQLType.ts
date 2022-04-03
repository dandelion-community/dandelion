import { AidRequestDetailsQuery_aidRequest } from './__generated__/AidRequestDetailsQuery';

export type AidRequestDetailsGraphQLType = Omit<
  AidRequestDetailsQuery_aidRequest,
  '_id'
> & {
  _id: NonNullable<AidRequestDetailsQuery_aidRequest['_id']>;
};

export function validate(
  arg: AidRequestDetailsQuery_aidRequest | undefined,
): AidRequestDetailsGraphQLType | undefined {
  if (arg == null) {
    return undefined;
  }
  const { _id, ...rest } = arg;
  if (_id == null) {
    return undefined;
  }
  return { _id, ...rest };
}

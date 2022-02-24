import type { UpdateArgs } from 'src/server/collections/aid_request/mutations/edit/UpdateType';

export default function getIsAdd(args: UpdateArgs): boolean {
  return args.input.action === 'Add';
}

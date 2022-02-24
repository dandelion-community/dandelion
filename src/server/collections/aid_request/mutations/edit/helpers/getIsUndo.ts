import type { UpdateArgs } from 'src/server/collections/aid_request/mutations/edit/UpdateType';

export default function isUndo(args: UpdateArgs): boolean {
  return args.undoID != null;
}

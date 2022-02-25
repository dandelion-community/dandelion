import type {
  UpdateArgs,
  UpdateResult,
} from 'src/server/collections/aid_request/mutations/edit/UpdateType';
import changeStringField from './changeStringField';

export default async function changeWhoIsItFor(
  args: UpdateArgs,
): Promise<UpdateResult> {
  return await changeStringField(args, { fieldName: 'whoIsItFor' });
}

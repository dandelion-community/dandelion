import { AidRequestDeletedModel } from 'src/server/collections/aid_request/AidRequestModel';

export default async function aidRequestHasBeenDeleted(
  aidRequestID: string,
): Promise<boolean> {
  const maybeDeletedObject = await AidRequestDeletedModel.findById(
    aidRequestID,
  );
  return maybeDeletedObject != null;
}

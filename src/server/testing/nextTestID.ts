import { ObjectId } from 'mongodb';

let idCount = 0;

export default function nextTestID(): ObjectId {
  idCount++;
  return new ObjectId(idCount.toString().padStart(24, '0'));
}

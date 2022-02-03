import { nanoid } from 'nanoid/non-secure';

const PREFIX = 'temp:';

export function createDraftID(): string {
  return PREFIX + nanoid();
}

export function isDraftID(id: string): boolean {
  return id.startsWith(PREFIX);
}

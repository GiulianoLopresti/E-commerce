import type { Status } from '../interfaces/status.interfaces';
import { STATUSES } from '../mocks/statuses.mocks'

export const getStatuses = (): Promise<Status[]> => {
  return Promise.resolve([...STATUSES]);
};

export const getStatusById = (id: number): Promise<Status | null> => {
  const status = STATUSES.find(s => s.id === id);
  return Promise.resolve(status || null);
};
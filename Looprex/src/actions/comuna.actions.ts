import type { Comuna } from '../interfaces/comuna.interfaces'
import { COMUNAS } from '../mocks/comunas.data'

export const getComunas = (): Promise<Comuna[]> => {
  return Promise.resolve([...COMUNAS]);
};

export const getComunasByRegion = (regionId: number): Promise<Comuna[]> => {
  const filtered = COMUNAS.filter(c => c.regionId === regionId);
  return Promise.resolve([...filtered]);
};
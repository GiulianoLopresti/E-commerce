import { REGIONS } from '../mocks';
import type { RegionsAllProps } from '../interfaces';

// (Cliente & Admin)
/** (READ) Obtiene TODAS las regiones */
export const getRegions = (): RegionsAllProps => {
  return { ok: true, statusCode: 200, regions: REGIONS };
};
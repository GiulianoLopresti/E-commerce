import { COMUNAS } from '../mocks';
import type { CommunesByRegionProps } from '../interfaces';

// (Cliente & Admin)
/** (READ) Simula la obtención de comunas filtradas por regionId */
export const getCommunesByRegion = (regionId: number): CommunesByRegionProps => {
  const communes = COMUNAS.filter(c => c.regionId === regionId);
  return { ok: true, statusCode: 200, communes };
};
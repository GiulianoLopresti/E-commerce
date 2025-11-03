import { COMUNAS } from '../mocks';
import type { CommunesByRegionProps } from '../interfaces';

// (Cliente & Admin)
/** (READ) Simula la obtención de comunas filtradas por regionId */
export const getCommunesByRegion = async (regionId: number): Promise<CommunesByRegionProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = COMUNAS.filter(c => c.regionId === regionId);
      resolve({ ok: true, statusCode: 200, communes: results });
    }, 150);
  });
};
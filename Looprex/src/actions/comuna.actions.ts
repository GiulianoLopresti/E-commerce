import { COMUNAS } from '../mocks';
import type { CommunesByRegionProps } from '../interfaces';

// (Cliente & Admin)
/** (READ) Simula la obtención de comunas filtradas por idRegion */
export const getCommunesByRegion = async (idRegion: number): Promise<CommunesByRegionProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = COMUNAS.filter(c => c.idRegion === idRegion);
      resolve({ ok: true, statusCode: 200, communes: results });
    }, 150);
  });
};
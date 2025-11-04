import { COMUNAS } from '../mocks';
import type { CommunesByRegionProps } from '../interfaces';

const COMMUNES_STATE = [...COMUNAS];

// (Cliente & Admin)
/** (READ) Obtiene las comunas filtradas por regionId */
export const getCommunesByRegion = (regionId: number): CommunesByRegionProps => {
  const communes = COMMUNES_STATE.filter(c => c.regionId === regionId).map(commune => ({ ...commune }));
  return { ok: true, statusCode: 200, communes };
};
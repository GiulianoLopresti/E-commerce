import { REGIONS } from '../mocks';
import type {RegionsAllProps } from '../interfaces';

// (Cliente & Admin)
/** (READ) Simula la obtención de TODAS las regiones */
export const getRegions = async (): Promise<RegionsAllProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, regions: REGIONS });
    }, 50);
  });
};
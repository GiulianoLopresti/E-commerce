/**
 * Actions de Regiones
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { RegionsService } from '@/services';
import type { RegionsAllProps, RegionByIdProps } from '@/interfaces';

/**
 * Obtener todas las regiones
 */
export const getRegions = async (): Promise<RegionsAllProps> => {
  try {
    const response = await RegionsService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        regions: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      regions: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener regiones:', error);
    return {
      ok: false,
      statusCode: 500,
      regions: [],
    };
  }
};

/**
 * Obtener una región por ID
 */
export const getRegionById = async (id: number): Promise<RegionByIdProps> => {
  try {
    const response = await RegionsService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        region: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      region: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener región:', error);
    return {
      ok: false,
      statusCode: 500,
      region: null,
    };
  }
};
/**
 * Actions de Comunas
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { ComunasService } from '@/services';
import type { CommunesByRegionProps, ComunasAllProps, ComunaByIdProps } from '@/interfaces';

/**
 * Obtener todas las comunas
 */
export const getComunas = async (): Promise<ComunasAllProps> => {
  try {
    const response = await ComunasService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        comunas: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      comunas: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener comunas:', error);
    return {
      ok: false,
      statusCode: 500,
      comunas: [],
    };
  }
};

/**
 * Obtener comunas por región
 */
export const getCommunesByRegion = async (regionId: number): Promise<CommunesByRegionProps> => {
  try {
    const response = await ComunasService.getByRegionId(regionId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        communes: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      communes: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener comunas por región:', error);
    return {
      ok: false,
      statusCode: 500,
      communes: [],
    };
  }
};

/**
 * Obtener una comuna por ID
 */
export const getComunaById = async (id: number): Promise<ComunaByIdProps> => {
  try {
    const response = await ComunasService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        comuna: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      comuna: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener comuna:', error);
    return {
      ok: false,
      statusCode: 500,
      comuna: null,
    };
  }
};
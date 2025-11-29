/**
 * Actions de Estados
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { StatusesService } from '@/services';
import type { StatusesAllProps, StatusByIdProps } from '@/interfaces';

/**
 * Obtener todos los estados
 */
export const getStatuses = async (): Promise<StatusesAllProps> => {
  try {
    const response = await StatusesService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        statuses: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      statuses: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener estados:', error);
    return {
      ok: false,
      statusCode: 500,
      statuses: [],
    };
  }
};

/**
 * Obtener un estado por ID
 */
export const getStatusById = async (id: number): Promise<StatusByIdProps> => {
  try {
    const response = await StatusesService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        status: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      status: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener estado:', error);
    return {
      ok: false,
      statusCode: 500,
      status: null,
    };
  }
};
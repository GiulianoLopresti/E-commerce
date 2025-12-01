import { DetailsService } from '../services/api/shopping.api';
import type { 
  DetailProps, 
  DetailsAllProps 
} from '../interfaces/detail.interfaces';

/**
 * Transforma objeto camelCase a snake_case para el backend
 */
const toSnakeCase = (obj: any): any => {
  const snakeObj: any = {};
  
  const camelToSnake = (str: string): string => {
    return str.replaceAll(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  };
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      snakeObj[camelToSnake(key)] = obj[key];
    }
  }
  
  return snakeObj;
};

/**
 * Transforma objeto snake_case a camelCase (respuesta del backend)
 */
const toCamelCase = (obj: any): any => {
  const camelObj: any = {};
  
  const snakeToCamel = (str: string): string => {
    return str.replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      camelObj[snakeToCamel(key)] = obj[key];
    }
  }
  
  return camelObj;
};

/**
 * Obtener todos los detalles
 */
export const getAllDetails = async (): Promise<DetailsAllProps> => {
  try {
    const response = await DetailsService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        details: [],
      };
    }

    // Mapear cada detalle de snake_case a camelCase
    const details = response.data?.map((detail: any) => toCamelCase(detail)) || [];

    return {
      ok: true,
      statusCode: response.statusCode,
      details: details,
    };
  } catch (error: any) {
    console.error('Error al obtener detalles:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      details: [],
    };
  }
};

/**
 * Obtener detalle por ID
 */
export const getDetailById = async (id: number): Promise<{
  ok: boolean;
  statusCode: number;
  detail: DetailProps | null;
  message?: string;
}> => {
  try {
    const response = await DetailsService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        detail: null,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      detail: toCamelCase(response.data),
      message: response.message,
    };
  } catch (error: any) {
    console.error('Error al obtener detalle:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      detail: null,
      message: error.message || 'Error al obtener detalle',
    };
  }
};

/**
 * Obtener detalles por ID de compra
 */
export const getDetailsByBuyId = async (buyId: number): Promise<DetailsAllProps> => {
  try {
    const response = await DetailsService.getByBuyId(buyId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        details: [],
      };
    }

    // Mapear cada detalle de snake_case a camelCase
    const details = response.data?.map((detail: any) => toCamelCase(detail)) || [];

    return {
      ok: true,
      statusCode: response.statusCode,
      details: details,
    };
  } catch (error: any) {
    console.error('Error al obtener detalles de la compra:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      details: [],
    };
  }
};

/**
 * Crear detalle
 */
export const createDetail = async (detailData: {
  buyId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}): Promise<{
  ok: boolean;
  statusCode: number;
  detail?: DetailProps;
  message?: string;
}> => {
  try {
    // Transformar a snake_case antes de enviar
    const detailDataSnakeCase = toSnakeCase(detailData);

    const response = await DetailsService.create(detailDataSnakeCase);

    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      detail: toCamelCase(response.data),
      message: 'Detalle creado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al crear detalle:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      message: error.message || 'Error al crear detalle',
    };
  }
};

/**
 * Actualizar detalle
 */
export const updateDetail = async (
  id: number,
  detailData: Partial<{
    buyId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>
): Promise<{
  ok: boolean;
  statusCode: number;
  detail?: DetailProps;
  message?: string;
}> => {
  try {
    // Transformar a snake_case antes de enviar
    const detailDataSnakeCase = toSnakeCase(detailData);

    const response = await DetailsService.update(id, detailDataSnakeCase);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      detail: toCamelCase(response.data),
      message: 'Detalle actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar detalle:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al actualizar el detalle',
    };
  }
};

/**
 * Eliminar detalle
 */
export const deleteDetail = async (id: number): Promise<{
  ok: boolean;
  statusCode: number;
  message?: string;
}> => {
  try {
    const response = await DetailsService.delete(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      message: 'Detalle eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar detalle:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      message: error.message || 'Error al eliminar detalle',
    };
  }
};
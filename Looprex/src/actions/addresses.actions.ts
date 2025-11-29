/**
 * Actions de Direcciones
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { AddressesService } from '@/services';
import type { AddressesAllProps } from '@/interfaces';

/**
 * Obtener todas las direcciones (ADMIN)
 */
export const getAddresses = async (): Promise<AddressesAllProps> => {
  try {
    const response = await AddressesService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        addresses: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      addresses: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener direcciones:', error);
    return {
      ok: false,
      statusCode: 500,
      addresses: [],
    };
  }
};

/**
 * Obtener direcciones de un usuario
 */
export const getAddressesByUserId = async (userId: number): Promise<AddressesAllProps> => {
  try {
    const response = await AddressesService.getByUserId(userId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        addresses: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      addresses: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener direcciones del usuario:', error);
    return {
      ok: false,
      statusCode: 500,
      addresses: [],
    };
  }
};

/**
 * Obtener una dirección por ID
 */
export const getAddressById = async (id: number): Promise<{ ok: boolean; statusCode: number; address: any }> => {
  try {
    const response = await AddressesService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        address: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      address: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener dirección:', error);
    return {
      ok: false,
      statusCode: 500,
      address: null,
    };
  }
};

/**
 * Crear una dirección
 */
export const createAddress = async (addressData: {
  userId: number;
  street: string;
  number: string;
  apartment?: string;
  comunaId: number;
}): Promise<{ ok: boolean; statusCode: number; message: string; address?: any }> => {
  try {
    const response = await AddressesService.create(addressData);
    
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
      message: 'Dirección creada exitosamente',
      address: response.data,
    };
  } catch (error: any) {
    console.error('Error al crear dirección:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al crear la dirección',
    };
  }
};

/**
 * Actualizar una dirección
 */
export const updateAddress = async (
  id: number,
  addressData: {
    userId: number;
    street: string;
    number: string;
    apartment?: string;
    comunaId: number;
  }
): Promise<{ ok: boolean; statusCode: number; message: string; address?: any }> => {
  try {
    const response = await AddressesService.update(id, addressData);
    
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
      message: 'Dirección actualizada exitosamente',
      address: response.data,
    };
  } catch (error: any) {
    console.error('Error al actualizar dirección:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al actualizar la dirección',
    };
  }
};

/**
 * Eliminar una dirección
 */
export const deleteAddress = async (id: number): Promise<{ ok: boolean; statusCode: number; message: string }> => {
  try {
    const response = await AddressesService.delete(id);
    
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
      message: 'Dirección eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar dirección:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al eliminar la dirección',
    };
  }
};
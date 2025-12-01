import { AddressesService } from '../services/api/geography.api';
import type { 
  AddressProps, 
  AddressesAllProps, 
  AddressCreateProps 
} from '../interfaces/address.interfaces';

/**
 * Obtener todas las direcciones
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
      addresses: response.data || [],
    };
  } catch (error: any) {
    console.error('Error al obtener direcciones:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      addresses: [],
    };
  }
};

/**
 * Obtener dirección por ID
 */
export const getAddressById = async (id: number): Promise<{
  ok: boolean;
  statusCode: number;
  address: AddressProps | null;
  message?: string;
}> => {
  try {
    const response = await AddressesService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        address: null,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      address: response.data || null,
      message: response.message,
    };
  } catch (error: any) {
    console.error('Error al obtener dirección:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      address: null,
      message: error.message || 'Error al obtener dirección',
    };
  }
};

/**
 * Obtener direcciones por usuario
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
      addresses: response.data || [],
    };
  } catch (error: any) {
    console.error('Error al obtener direcciones del usuario:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      addresses: [],
    };
  }
};

/**
 * Crear nueva dirección
 */
export const createAddress = async (addressData: {
  userId: number;
  street: string;
  number: string;
  comunaId: number;
}): Promise<AddressCreateProps> => {
  try {
    const response = await AddressesService.create({
      userId: addressData.userId,
      street: addressData.street,
      number: addressData.number,
      comuna: {
        comunaId: addressData.comunaId
      }
    });

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
      statusCode: error.response?.status || 500,
      message: error.message || 'Error al crear dirección',
    };
  }
};

/**
 * Actualizar dirección
 */
export const updateAddress = async (
  id: number,
  addressData: {
    userId: number;
    street: string;
    number: string;
    comuna: { comunaId: number };
  }
): Promise<AddressCreateProps> => {
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
 * Eliminar dirección
 */
export const deleteAddress = async (id: number): Promise<{
  ok: boolean;
  statusCode: number;
  message?: string;
}> => {
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
      statusCode: error.response?.status || 500,
      message: error.message || 'Error al eliminar dirección',
    };
  }
};
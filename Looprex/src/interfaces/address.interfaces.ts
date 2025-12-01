/**
 * Interfaces de Direcciones
 */

/**
 * Estructura de una dirección (coincide con AddressApiResponse del backend)
 */

import type { ComunaProps } from './comuna.interfaces';


export interface AddressProps {
  addressId: number;
  userId: number;
  street: string;
  number: string;
  comuna: ComunaProps;
}

/**
 * Respuesta al obtener direcciones
 */
export interface AddressesAllProps {
  ok: boolean;
  statusCode: number;
  addresses: AddressProps[];
}

export interface CreateAddressRequest {
  userId: number;
  street: string;
  number: string;
  comuna: {              // ← Objeto con solo el ID
    comunaId: number;
  };
}

/**
 * Respuesta al crear dirección
 */
export interface AddressCreateProps {
  ok: boolean;
  statusCode: number;
  address?: AddressProps;
  message?: string;
}
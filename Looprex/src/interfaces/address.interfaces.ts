/**
 * Interfaces de Direcciones
 */

/**
 * Estructura de una dirección (coincide con AddressApiResponse del backend)
 */
export interface AddressProps {
  addressId: number;
  userId: number;
  street: string;
  number: string;
  apartment?: string;
  // Objeto anidado (como viene del backend)
  comuna: {
    comunaId: number;
    name: string;
    regionId: number;
  };
}

/**
 * Request para crear/actualizar dirección
 */
export interface AddressRequest {
  userId: number;
  street: string;
  number: string;
  apartment?: string;
  comunaId: number;  // Solo ID
}

/**
 * Respuesta al obtener direcciones
 */
export interface AddressesAllProps {
  ok: boolean;
  statusCode: number;
  addresses: AddressProps[];
}
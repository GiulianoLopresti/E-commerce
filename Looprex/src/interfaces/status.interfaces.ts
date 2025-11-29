/**
 * Interfaces de Estados
 */

/**
 * Estructura de un estado
 */
export interface StatusProps {
  statusId: number;
  name: string;
}

/**
 * Respuesta al obtener todos los estados
 */
export interface StatusesAllProps {
  ok: boolean;
  statusCode: number;
  statuses: StatusProps[];
}

/**
 * Respuesta al obtener un estado por ID
 */
export interface StatusByIdProps {
  ok: boolean;
  statusCode: number;
  status: StatusProps | null;
}
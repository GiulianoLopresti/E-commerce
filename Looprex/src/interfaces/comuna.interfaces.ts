/**
 * Interfaces de Comunas
 */

/**
 * Estructura de una comuna
 */
export interface ComunaProps {
  comunaId: number;
  name: string;
  regionId: number;
}

/**
 * Respuesta al obtener todas las comunas
 */
export interface ComunasAllProps {
  ok: boolean;
  statusCode: number;
  comunas: ComunaProps[];
}

/**
 * Respuesta al obtener comunas por región
 */
export interface CommunesByRegionProps {
  ok: boolean;
  statusCode: number;
  communes: ComunaProps[];
}

/**
 * Respuesta al obtener una comuna por ID
 */
export interface ComunaByIdProps {
  ok: boolean;
  statusCode: number;
  comuna: ComunaProps | null;
}
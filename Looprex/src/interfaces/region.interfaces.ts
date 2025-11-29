/**
 * Interfaces de Regiones
 */

/**
 * Estructura de una región
 */
export interface RegionProps {
  regionId: number;
  name: string;
}

/**
 * Respuesta al obtener todas las regiones
 */
export interface RegionsAllProps {
  ok: boolean;
  statusCode: number;
  regions: RegionProps[];
}

/**
 * Respuesta al obtener una región por ID
 */
export interface RegionByIdProps {
  ok: boolean;
  statusCode: number;
  region: RegionProps | null;
}
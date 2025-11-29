/**
 * Interfaces de Roles
 */

/**
 * Estructura de un rol
 */
export interface RoleProps {
  roleId: number;
  name: string;
}

/**
 * Respuesta al obtener todos los roles
 */
export interface RolesAllProps {
  ok: boolean;
  statusCode: number;
  roles: RoleProps[];
}

/**
 * Respuesta al obtener un rol por ID
 */
export interface RoleByIdProps {
  ok: boolean;
  statusCode: number;
  role: RoleProps | null;
}
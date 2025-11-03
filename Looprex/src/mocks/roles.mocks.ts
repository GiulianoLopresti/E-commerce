// Importamos la interfaz que define la forma de un Rol
import type { RoleProps } from '../interfaces';

// (Asumimos idEstado 1 = Activo)
export const ROLES: RoleProps[] = [
  {
    roleId: 1,
    name: 'Admin',
  },
  {
    roleId: 2,
    name: 'Cliente',
  },
];
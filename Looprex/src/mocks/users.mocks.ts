import type { UserProps } from '../interfaces';

// Usamos los idRole de roles.mocks.ts (1 = Admin, 2 = Cliente)
// Asumimos idStatus: 1 = Activo
export const USERS: UserProps[] = [
  {
    idUser: 1,
    rut: '11.111.111-1',
    name: 'Giuliano',
    lastName: 'Lopresti',
    phone: '+56912345678',
    email: 'admin@looprex.cl',
    password: 'admin123',
    idRole: 1, // Administrador
    idStatus: 1,
    profilePhoto: ''
  },
  {
    idUser: 2,
    rut: '22.222.222-2',
    name: 'Juan',
    lastName: 'Pérez',
    phone: '+56987654321',
    email: 'juan.perez@cliente.cl',
    password: 'cliente123',
    idRole: 2, // Cliente
    idStatus: 1,
    profilePhoto: ''
  },
  {
    idUser: 3,
    rut: '33.333.333-3',
    name: 'María',
    lastName: 'González',
    phone: '+56955554444',
    email: 'maria.gonzalez@cliente.cl',
    password: 'password456',
    idRole: 2, // Cliente
    idStatus: 1,
    profilePhoto: ''
  }
];
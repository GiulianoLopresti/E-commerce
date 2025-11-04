import { USERS, ROLES } from '../mocks';
import type { 
  UserProps, 
  RolesAllProps,
  UsersAllProps,
  UserLoginProps, 
  UserRegisterProps,
  UserUpdateProps,
  UserDeleteProps
} from '../interfaces';

// --- Acciones de Cliente ---

/** (READ) Simula un Login */
export type LoginCredentials = Pick<UserProps, 'email' | 'password'>;
export const loginUser = async ({ email, password }: LoginCredentials): Promise<UserLoginProps> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) {
        resolve({ ok: true, statusCode: 200, user: user });
      } else {
        reject(new Error('Credenciales incorrectas'));
      }
    }, 700);
  });
};

/** (CREATE) Simula el registro de un nuevo cliente */
type RegisterData = Omit<UserProps, 'userId' | 'roleId' | 'statusId'>;
export const registerUser = async (data: RegisterData): Promise<UserRegisterProps> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const emailExists = USERS.some(u => u.email === data.email);
      if (emailExists) {
        return reject(new Error('El correo ya está registrado'));
      }
      const newUser: UserProps = { ...data, userId: 99, roleId: 2, statusId: 1 };
      resolve({ ok: true, statusCode: 201, user: newUser });
    }, 1000);
  });
};

/** (UPDATE) Simula al cliente actualizando su propio perfil */
type UpdateProfileData = Partial<Omit<UserProps, 'userId' | 'roleId' | 'statusId' | 'password'>>;
export const updateUserProfile = async (userId: number, data: UpdateProfileData): Promise<UserUpdateProps> => {
  return new Promise(resolve => {
     const user = USERS.find(u => u.userId === userId);
     if (user) {
       const updatedUser = { ...user, ...data };
       resolve({ ok: true, statusCode: 200, user: updatedUser });
     } else {
       resolve({ ok: false, statusCode: 404, user: {} as UserProps });
     }
  });
};

// --- Acciones de Admin ---

/** (READ) Simula la obtención de TODOS los roles */
export const getRoles = async (): Promise<RolesAllProps> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ ok: true, statusCode: 200, roles: ROLES }), 50);
  });
};

/** (READ) Simula la obtención de TODOS los usuarios */
export const getAllUsers = async (): Promise<UsersAllProps> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ ok: true, statusCode: 200, users: USERS }), 400);
  });
};

/** (UPDATE) Simula al admin actualizando cualquier usuario (ej. cambiar rol) */
export const updateUserByAdmin = async (userId: number, data: Partial<UserProps>): Promise<UserUpdateProps> => {
  return new Promise((resolve, reject) => {
     const user = USERS.find(u => u.userId === userId);
     if (!user) {
       resolve({ ok: false, statusCode: 404, user: {} as UserProps });
       return;
     }
     // Agregamos validación para el roleId
     if (data.roleId && ![1, 2].includes(data.roleId)) {
       reject(new Error('Invalid role ID'));
       return;
     }
     const updatedUser = { ...user, ...data };
     resolve({ ok: true, statusCode: 200, user: updatedUser });
  });
};

/** (DELETE) Simula la eliminación de un usuario */
export const deleteUser = async (): Promise<UserDeleteProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, message: 'Usuario eliminado' });
    }, 500);
  });
};
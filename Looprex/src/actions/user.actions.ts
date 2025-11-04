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
export const loginUser = ({ email, password }: LoginCredentials): UserLoginProps => {
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }
  return { ok: true, statusCode: 200, user };
};

/** (CREATE) Registra un nuevo cliente */
type RegisterData = Omit<UserProps, 'userId' | 'roleId' | 'statusId'>;
export const registerUser = (data: RegisterData): UserRegisterProps => {
  const emailExists = USERS.some(u => u.email === data.email);
  if (emailExists) {
    throw new Error('El correo ya está registrado');
  }
  const newUser: UserProps = { ...data, userId: 99, roleId: 2, statusId: 1 };
  return { ok: true, statusCode: 201, user: newUser };
};

/** (UPDATE) Actualiza el propio perfil del cliente */
type UpdateProfileData = Partial<Omit<UserProps, 'userId' | 'roleId' | 'statusId' | 'password'>>;
export const updateUserProfile = (userId: number, data: UpdateProfileData): UserUpdateProps => {
  const user = USERS.find(u => u.userId === userId);
  if (user) {
    const updatedUser = { ...user, ...data };
    return { ok: true, statusCode: 200, user: updatedUser };
  }
  return { ok: false, statusCode: 404, user: {} as UserProps };
};

// --- Acciones de Admin ---

/** (READ) Obtiene TODOS los roles */
export const getRoles = (): RolesAllProps => {
  return { ok: true, statusCode: 200, roles: ROLES };
};

/** (READ) Obtiene TODOS los usuarios */
export const getAllUsers = (): UsersAllProps => {
  return { ok: true, statusCode: 200, users: USERS };
};

/** (UPDATE) El admin actualiza a cualquier usuario (ej. cambiar rol) */
export const updateUserByAdmin = (userId: number, data: Partial<UserProps>): UserUpdateProps => {
  const user = USERS.find(u => u.userId === userId);
  if (!user) {
    return { ok: false, statusCode: 404, user: {} as UserProps };
  }
  if (data.roleId && ![1, 2].includes(data.roleId)) {
    throw new Error('Invalid role ID');
  }
  const updatedUser = { ...user, ...data };
  return { ok: true, statusCode: 200, user: updatedUser };
};

/** (DELETE) Elimina un usuario */
export const deleteUser = (): UserDeleteProps => {
  return { ok: true, statusCode: 200, message: 'Usuario eliminado' };
};
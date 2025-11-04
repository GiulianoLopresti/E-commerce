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

let USERS_STATE: UserProps[] = [...USERS];
const ROLES_STATE: typeof ROLES = [...ROLES];

const cloneUser = (user: UserProps): UserProps => ({ ...user });

const getNextUserId = (): number => {
  if (USERS_STATE.length === 0) {
    return 1;
  }
  return Math.max(...USERS_STATE.map(user => user.userId)) + 1;
};

// --- Acciones de Cliente ---

/** (READ) Login */
export type LoginCredentials = Pick<UserProps, 'email' | 'password'>;
export const loginUser = ({ email, password }: LoginCredentials): UserLoginProps => {
  const user = USERS_STATE.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }
  return { ok: true, statusCode: 200, user: cloneUser(user) };
};

/** (CREATE) Registra un nuevo cliente */
type RegisterData = Omit<UserProps, 'userId' | 'roleId' | 'statusId'>;
export const registerUser = (data: RegisterData): UserRegisterProps => {
  const emailExists = USERS_STATE.some(u => u.email === data.email);
  if (emailExists) {
    throw new Error('El correo ya está registrado');
  }
  const newUser: UserProps = {
    ...data,
    userId: getNextUserId(),
    roleId: 2,
    statusId: 1
  };
  USERS_STATE = [...USERS_STATE, newUser];
  return { ok: true, statusCode: 201, user: cloneUser(newUser) };
};

/** (UPDATE) Actualiza el propio perfil del cliente */
type UpdateProfileData = Partial<Omit<UserProps, 'userId' | 'roleId' | 'statusId' | 'password'>>;
export const updateUserProfile = (userId: number, data: UpdateProfileData): UserUpdateProps => {
  const userIndex = USERS_STATE.findIndex(u => u.userId === userId);
  if (userIndex !== -1) {
    const updatedUser: UserProps = {
      ...USERS_STATE[userIndex],
      ...data,
      userId: USERS_STATE[userIndex].userId,
      roleId: USERS_STATE[userIndex].roleId,
      statusId: USERS_STATE[userIndex].statusId,
      password: USERS_STATE[userIndex].password
    };
    USERS_STATE = [
      ...USERS_STATE.slice(0, userIndex),
      updatedUser,
      ...USERS_STATE.slice(userIndex + 1)
    ];
    return { ok: true, statusCode: 200, user: cloneUser(updatedUser) };
  }
  return { ok: false, statusCode: 404, user: {} as UserProps };
};

// --- Acciones de Admin ---

/** (READ) Obtiene TODOS los roles */
export const getRoles = (): RolesAllProps => {
  return { ok: true, statusCode: 200, roles: [...ROLES_STATE] };
};

/** (READ) Obtiene TODOS los usuarios */
export const getAllUsers = (): UsersAllProps => {
  return { ok: true, statusCode: 200, users: USERS_STATE.map(cloneUser) };
};

/** (UPDATE) El admin actualiza a cualquier usuario (ej. cambiar rol) */
export const updateUserByAdmin = (userId: number, data: Partial<UserProps>): UserUpdateProps => {
  const userIndex = USERS_STATE.findIndex(u => u.userId === userId);
  if (userIndex === -1) {
    return { ok: false, statusCode: 404, user: {} as UserProps };
  }
  if (data.roleId && !ROLES_STATE.some(role => role.roleId === data.roleId)) {
    throw new Error('Invalid role ID');
  }
  const updatedUser: UserProps = {
    ...USERS_STATE[userIndex],
    ...data,
    userId: USERS_STATE[userIndex].userId
  };
  USERS_STATE = [
    ...USERS_STATE.slice(0, userIndex),
    updatedUser,
    ...USERS_STATE.slice(userIndex + 1)
  ];
  return { ok: true, statusCode: 200, user: cloneUser(updatedUser) };
};

/** (DELETE) Elimina un usuario */
export const deleteUser = (userId: number): UserDeleteProps => {
  const initialLength = USERS_STATE.length;
  USERS_STATE = USERS_STATE.filter(user => user.userId !== userId);
  if (USERS_STATE.length === initialLength) {
    return { ok: false, statusCode: 404, message: 'Usuario no encontrado' };
  }
  return { ok: true, statusCode: 200, message: 'Usuario eliminado' };
};
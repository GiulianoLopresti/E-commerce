/**
 * Interfaces de Usuarios
 */

/**
 * Estructura de un usuario (coincide con UserApiResponse del backend)
 */
export interface UserProps {
  userId: number;
  email: string;
  rut: string;
  name: string;
  lastname: string;
  phone: string;
  profilePhoto: string;
  // Objeto anidado (como viene del backend)
  role: {
    roleId: number;
    name: string;
  };
}

/**
 * Request para crear usuario (registro)
 */
export interface UserRegisterRequest {
  email: string;
  password: string;
  rut: string;
  name: string;
  lastname: string;
  phone: string;
  profilePhoto?: string;
  role: {             
    roleId: number;
  };
  statusId: number;
}

/**
 * Request para login
 */
export interface UserLoginRequest {
  email: string;
  password: string;
}

/**
 * Respuesta de login
 */
export interface UserLoginProps {
  ok: boolean;
  statusCode: number;
  user: UserProps | null;
  message?: string;
}

/**
 * Respuesta al obtener usuarios
 */
export interface UsersAllProps {
  ok: boolean;
  statusCode: number;
  users: UserProps[];
}

/**
 * Respuesta al crear usuario (registro)
 */
export interface UserCreateProps {  // ← AGREGAR ESTO
  ok: boolean;
  statusCode: number;
  user?: UserProps;
  message?: string;
}
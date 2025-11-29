/**
 * Actions de Usuarios
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { UsersService } from '@/services';
import type { UserLoginProps, UsersAllProps } from '@/interfaces';

/**
 * Login de usuario
 */
export const loginUser = async (email: string, password: string): Promise<UserLoginProps> => {
  try {
    const response = await UsersService.login({ email, password });
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        user: null,
        message: response.message || 'Credenciales incorrectas',
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      user: response.data,
    };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    return {
      ok: false,
      statusCode: 500,
      user: null,
      message: 'Error al conectar con el servidor',
    };
  }
};

/**
 * Obtener todos los usuarios (ADMIN)
 */
export const getUsers = async (): Promise<UsersAllProps> => {
  try {
    const response = await UsersService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        users: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      users: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return {
      ok: false,
      statusCode: 500,
      users: [],
    };
  }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (id: number): Promise<UserLoginProps> => {
  try {
    const response = await UsersService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        user: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      user: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    return {
      ok: false,
      statusCode: 500,
      user: null,
    };
  }
};

/**
 * Registrar un nuevo usuario
 */
export const registerUser = async (userData: {
  email: string;
  password: string;
  rut: string;
  name: string;
  lastname: string;
  phone: string;
  profilePhoto?: string;
}): Promise<UserLoginProps> => {
  try {
    const response = await UsersService.create({
      ...userData,
      roleId: 2, // 2 = Cliente por defecto
    });
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        user: null,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      user: response.data,
      message: 'Usuario registrado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    return {
      ok: false,
      statusCode: 500,
      user: null,
      message: 'Error al registrar el usuario',
    };
  }
};

/**
 * Actualizar datos personales
 */
export const updateUserPersonalData = async (
  userId: number,
  data: { rut: string; name: string; lastname: string; phone: string }
): Promise<UserLoginProps> => {
  try {
    const response = await UsersService.updatePersonalData(userId, data);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        user: null,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      user: response.data,
      message: 'Datos actualizados exitosamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar datos:', error);
    return {
      ok: false,
      statusCode: 500,
      user: null,
      message: 'Error al actualizar los datos',
    };
  }
};

/**
 * Actualizar foto de perfil
 */
export const updateUserProfilePhoto = async (
  userId: number,
  profilePhoto: string
): Promise<UserLoginProps> => {
  try {
    const response = await UsersService.updateProfilePhoto(userId, profilePhoto);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        user: null,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      user: response.data,
      message: 'Foto actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar foto:', error);
    return {
      ok: false,
      statusCode: 500,
      user: null,
      message: 'Error al actualizar la foto',
    };
  }
};

/**
 * Cambiar contraseña
 */
export const updateUserPassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<{ ok: boolean; statusCode: number; message: string }> => {
  try {
    const response = await UsersService.updatePassword(userId, oldPassword, newPassword);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message || 'Error al cambiar la contraseña',
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      message: 'Contraseña actualizada exitosamente',
    };
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al cambiar la contraseña',
    };
  }
};

/**
 * Eliminar un usuario (ADMIN)
 */
export const deleteUser = async (userId: number): Promise<{ ok: boolean; statusCode: number; message: string }> => {
  try {
    const response = await UsersService.delete(userId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      message: 'Usuario eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al eliminar el usuario',
    };
  }
};
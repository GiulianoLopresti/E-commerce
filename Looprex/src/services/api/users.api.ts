/**
 * Servicio API de Usuarios
 * 
 * Este servicio reemplaza los mocks de usuarios.
 * Hace peticiones HTTP reales al microservicio de usuarios (puerto 8081)
 */

import { usersClient } from './client.api';
import type { 
  UserApiResponse, 
  RoleApiResponse,
  LoginRequest,
  CreateUserRequest,
  ApiResponse 
} from '@/interfaces/api.interfaces';

/**
 * Usuarios
 */
export const UsersService = {
  /**
   * Login
   * POST /api/users/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<UserApiResponse>> {
    return usersClient.post<UserApiResponse>('/api/users/login', credentials);
  },

  /**
   * Obtener todos los usuarios (ADMIN)
   * GET /api/users
   */
  async getAll(): Promise<ApiResponse<UserApiResponse[]>> {
    return usersClient.get<UserApiResponse[]>('/api/users');
  },

  /**
   * Obtener un usuario por ID
   * GET /api/users/{id}
   */
  async getById(id: number): Promise<ApiResponse<UserApiResponse>> {
    return usersClient.get<UserApiResponse>(`/api/users/${id}`);
  },

  /**
   * Crear un usuario (Registro)
   * POST /api/users
   */
  async create(user: CreateUserRequest): Promise<ApiResponse<UserApiResponse>> {
    return usersClient.post<UserApiResponse>('/api/users/register', user);
  },

  /**
   * Actualizar datos personales
   * PUT /api/users/{id}/personal-data
   */
  async updatePersonalData(
    id: number, 
    data: { rut: string; name: string; lastname: string; phone: string }
  ): Promise<ApiResponse<UserApiResponse>> {
    return usersClient.put<UserApiResponse>(`/api/users/${id}/personal-data`, data);
  },

  /**
   * Actualizar foto de perfil
   * PUT /api/users/{id}/profile-photo
   */
  async updateProfilePhoto(id: number, profilePhoto: string): Promise<ApiResponse<UserApiResponse>> {
    return usersClient.put<UserApiResponse>(`/api/users/${id}/profile-photo`, { profilePhoto });
  },

  /**
   * Actualizar contraseña
   * PUT /api/users/{id}/password
   */
  async updatePassword(
    id: number, 
    oldPassword: string, 
    newPassword: string
  ): Promise<ApiResponse<void>> {
    return usersClient.put<void>(`/api/users/${id}/password`, { oldPassword, newPassword });
  },

  /**
   * Eliminar un usuario (ADMIN)
   * DELETE /api/users/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return usersClient.delete<void>(`/api/users/${id}`);
  },
};

/**
 * Roles
 */
export const RolesService = {
  /**
   * Obtener todos los roles
   * GET /api/roles
   */
  async getAll(): Promise<ApiResponse<RoleApiResponse[]>> {
    return usersClient.get<RoleApiResponse[]>('/api/roles');
  },

  /**
   * Obtener un rol por ID
   * GET /api/roles/{id}
   */
  async getById(id: number): Promise<ApiResponse<RoleApiResponse>> {
    return usersClient.get<RoleApiResponse>(`/api/roles/${id}`);
  },
};
/**
 * Servicio API de Geografía
 * 
 * Este servicio reemplaza los mocks de direcciones, regiones y comunas.
 * Hace peticiones HTTP reales al microservicio de geografía (puerto 8082)
 */

import { geographyClient } from './client.api';
import type { 
  AddressApiResponse, 
  RegionApiResponse,
  ComunaApiResponse,
  ApiResponse 
} from '@/interfaces/api.interfaces';

import type {CreateAddressRequest} from '@/interfaces/address.interfaces';
/**
 * Direcciones
 */
export const AddressesService = {
  /**
   * Obtener todas las direcciones (ADMIN)
   * GET /api/addresses
   */
  async getAll(): Promise<ApiResponse<AddressApiResponse[]>> {
    return geographyClient.get<AddressApiResponse[]>('/api/addresses');
  },

  /**
   * Obtener una dirección por ID
   * GET /api/addresses/{id}
   */
  async getById(id: number): Promise<ApiResponse<AddressApiResponse>> {
    return geographyClient.get<AddressApiResponse>(`/api/addresses/${id}`);
  },

  /**
   * Obtener direcciones de un usuario
   * GET /api/addresses/user/{userId}
   */
  async getByUserId(userId: number): Promise<ApiResponse<AddressApiResponse[]>> {
    return geographyClient.get<AddressApiResponse[]>(`/api/addresses/user/${userId}`);
  },

  /**
   * Crear una dirección
   * POST /api/addresses
   */
  async create(address: CreateAddressRequest): Promise<ApiResponse<AddressApiResponse>> {
    return geographyClient.post<AddressApiResponse>('/api/addresses', address);
  },

  /**
   * Actualizar una dirección
   * PUT /api/addresses/{id}
   */
  async update(id: number, address: CreateAddressRequest): Promise<ApiResponse<AddressApiResponse>> {
    return geographyClient.put<AddressApiResponse>(`/api/addresses/${id}`, address);
  },

  /**
   * Eliminar una dirección
   * DELETE /api/addresses/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return geographyClient.delete<void>(`/api/addresses/${id}`);
  },
};

/**
 * Regiones
 */
export const RegionsService = {
  /**
   * Obtener todas las regiones
   * GET /api/regions
   */
  async getAll(): Promise<ApiResponse<RegionApiResponse[]>> {
    return geographyClient.get<RegionApiResponse[]>('/api/regions');
  },

  /**
   * Obtener una región por ID
   * GET /api/regions/{id}
   */
  async getById(id: number): Promise<ApiResponse<RegionApiResponse>> {
    return geographyClient.get<RegionApiResponse>(`/api/regions/${id}`);
  },
};

/**
 * Comunas
 */
export const ComunasService = {
  /**
   * Obtener todas las comunas
   * GET /api/comunas
   */
  async getAll(): Promise<ApiResponse<ComunaApiResponse[]>> {
    return geographyClient.get<ComunaApiResponse[]>('/api/comunas');
  },

  /**
   * Obtener una comuna por ID
   * GET /api/comunas/{id}
   */
  async getById(id: number): Promise<ApiResponse<ComunaApiResponse>> {
    return geographyClient.get<ComunaApiResponse>(`/api/comunas/${id}`);
  },

  /**
   * Obtener comunas por región
   * GET /api/comunas/region/{regionId}
   */
  async getByRegionId(regionId: number): Promise<ApiResponse<ComunaApiResponse[]>> {
    return geographyClient.get<ComunaApiResponse[]>(`/api/comunas/region/${regionId}`);
  },
};
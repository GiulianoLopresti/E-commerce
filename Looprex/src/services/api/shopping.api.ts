/**
 * Servicio API de Compras
 * 
 * Este servicio reemplaza los mocks de órdenes.
 * Hace peticiones HTTP reales al microservicio de shopping (puerto 8083)
 * 
 * IMPORTANTE: El backend usa "Buy" y "Detail"
 */

import { shoppingClient } from './client.api';
import type { 
  BuyApiResponse, 
  DetailApiResponse,
  CreateBuyRequest,
  CreateDetailRequest,
  ApiResponse 
} from '@/interfaces/api.interfaces';

/**
 * Compras (Buys)
 */
export const BuysService = {
  /**
   * Obtener todas las compras (ADMIN)
   * GET /api/buys
   */
  async getAll(): Promise<ApiResponse<BuyApiResponse[]>> {
    return shoppingClient.get<BuyApiResponse[]>('/api/buys');
  },

  /**
   * Obtener una compra por ID
   * GET /api/buys/{id}
   */
  async getById(id: number): Promise<ApiResponse<BuyApiResponse>> {
    return shoppingClient.get<BuyApiResponse>(`/api/buys/${id}`);
  },

  /**
   * Obtener compras de un usuario
   * GET /api/buys/user/{userId}
   */
  async getByUserId(userId: number): Promise<ApiResponse<BuyApiResponse[]>> {
    return shoppingClient.get<BuyApiResponse[]>(`/api/buys/user/${userId}`);
  },

  /**
   * Crear una compra
   * POST /api/buys
   * 
   * IMPORTANTE: Después de crear el Buy, debes crear los Details con el buyId
   */
  async create(buy: CreateBuyRequest): Promise<ApiResponse<BuyApiResponse>> {
    return shoppingClient.post<BuyApiResponse>('/api/buys', buy);
  },

  /**
   * Actualizar una compra (principalmente el estado)
   * PUT /api/buys/{id}
   */
  async update(id: number, statusId: number): Promise<ApiResponse<BuyApiResponse>> {
    return shoppingClient.put<BuyApiResponse>(`/api/buys/${id}`, { statusId });
  },

  /**
   * Eliminar una compra (ADMIN)
   * DELETE /api/buys/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return shoppingClient.delete<void>(`/api/buys/${id}`);
  },
};

/**
 * Detalles de Compra (Details)
 */
export const DetailsService = {
  /**
   * Obtener todos los detalles (ADMIN)
   * GET /api/details
   */
  async getAll(): Promise<ApiResponse<DetailApiResponse[]>> {
    return shoppingClient.get<DetailApiResponse[]>('/api/details');
  },

  /**
   * Obtener un detalle por ID
   * GET /api/details/{id}
   */
  async getById(id: number): Promise<ApiResponse<DetailApiResponse>> {
    return shoppingClient.get<DetailApiResponse>(`/api/details/${id}`);
  },

  /**
   * Obtener detalles de una compra
   * GET /api/details/buy/{buyId}
   */
  async getByBuyId(buyId: number): Promise<ApiResponse<DetailApiResponse[]>> {
    return shoppingClient.get<DetailApiResponse[]>(`/api/details/buy/${buyId}`);
  },

  /**
   * Crear un detalle
   * POST /api/details
   */
  async create(detail: CreateDetailRequest): Promise<ApiResponse<DetailApiResponse>> {
    return shoppingClient.post<DetailApiResponse>('/api/details', detail);
  },

  /**
   * Actualizar un detalle
   * PUT /api/details/{id}
   */
  async update(id: number, detail: CreateDetailRequest): Promise<ApiResponse<DetailApiResponse>> {
    return shoppingClient.put<DetailApiResponse>(`/api/details/${id}`, detail);
  },

  /**
   * Eliminar un detalle
   * DELETE /api/details/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return shoppingClient.delete<void>(`/api/details/${id}`);
  },
};
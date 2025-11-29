/**
 * Servicio API de Productos
 * 
 * Este servicio reemplaza los mocks de productos.
 * Hace peticiones HTTP reales al microservicio de productos (puerto 8080)
 */

import { productsClient } from './client.api';
import type { 
  ProductApiResponse, 
  CategoryApiResponse,
  StatusApiResponse,
  CreateProductRequest,
  ApiResponse 
} from '@/interfaces/api.interfaces';

/**
 * Productos
 */
export const ProductsService = {
  /**
   * Obtener todos los productos
   * GET /api/products
   */
  async getAll(): Promise<ApiResponse<ProductApiResponse[]>> {
    return productsClient.get<ProductApiResponse[]>('/api/products');
  },

  /**
   * Obtener un producto por ID
   * GET /api/products/{id}
   */
  async getById(id: number): Promise<ApiResponse<ProductApiResponse>> {
    return productsClient.get<ProductApiResponse>(`/api/products/${id}`);
  },

  /**
   * Obtener productos por categoría
   * GET /api/products/category/{categoryId}
   */
  async getByCategory(categoryId: number): Promise<ApiResponse<ProductApiResponse[]>> {
    return productsClient.get<ProductApiResponse[]>(`/api/products/category/${categoryId}`);
  },

  /**
   * Buscar productos por nombre
   * GET /api/products/search?query=texto
   */
  async search(query: string): Promise<ApiResponse<ProductApiResponse[]>> {
    return productsClient.get<ProductApiResponse[]>(`/api/products/search?query=${encodeURIComponent(query)}`);
  },

  /**
   * Obtener productos por estado
   * GET /api/products/status/{statusId}
   */
  async getByStatus(statusId: number): Promise<ApiResponse<ProductApiResponse[]>> {
    return productsClient.get<ProductApiResponse[]>(`/api/products/status/${statusId}`);
  },

  /**
   * Crear un producto (ADMIN)
   * POST /api/products
   */
  async create(product: CreateProductRequest): Promise<ApiResponse<ProductApiResponse>> {
    return productsClient.post<ProductApiResponse>('/api/products', product);
  },

  /**
   * Actualizar un producto (ADMIN)
   * PUT /api/products/{id}
   */
  async update(id: number, product: CreateProductRequest): Promise<ApiResponse<ProductApiResponse>> {
    return productsClient.put<ProductApiResponse>(`/api/products/${id}`, product);
  },

  /**
   * Eliminar un producto (ADMIN)
   * DELETE /api/products/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return productsClient.delete<void>(`/api/products/${id}`);
  },
};

/**
 * Categorías
 */
export const CategoriesService = {
  /**
   * Obtener todas las categorías
   * GET /api/categories
   */
  async getAll(): Promise<ApiResponse<CategoryApiResponse[]>> {
    return productsClient.get<CategoryApiResponse[]>('/api/categories');
  },

  /**
   * Obtener una categoría por ID
   * GET /api/categories/{id}
   */
  async getById(id: number): Promise<ApiResponse<CategoryApiResponse>> {
    return productsClient.get<CategoryApiResponse>(`/api/categories/${id}`);
  },

  /**
   * Crear una categoría (ADMIN)
   * POST /api/categories
   */
  async create(name: string): Promise<ApiResponse<CategoryApiResponse>> {
    return productsClient.post<CategoryApiResponse>('/api/categories', { name });
  },

  /**
   * Actualizar una categoría (ADMIN)
   * PUT /api/categories/{id}
   */
  async update(id: number, name: string): Promise<ApiResponse<CategoryApiResponse>> {
    return productsClient.put<CategoryApiResponse>(`/api/categories/${id}`, { name });
  },

  /**
   * Eliminar una categoría (ADMIN)
   * DELETE /api/categories/{id}
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    return productsClient.delete<void>(`/api/categories/${id}`);
  },
};

/**
 * Estados
 */
export const StatusesService = {
  /**
   * Obtener todos los estados
   * GET /api/statuses
   */
  async getAll(): Promise<ApiResponse<StatusApiResponse[]>> {
    return productsClient.get<StatusApiResponse[]>('/api/statuses');
  },

  /**
   * Obtener un estado por ID
   * GET /api/statuses/{id}
   */
  async getById(id: number): Promise<ApiResponse<StatusApiResponse>> {
    return productsClient.get<StatusApiResponse>(`/api/statuses/${id}`);
  },
};
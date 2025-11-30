/**
 * Cliente HTTP base para comunicación con las APIs
 * 
 * Este archivo proporciona funciones reutilizables para hacer peticiones
 * HTTP a los diferentes microservicios del backend.
 * 
 * Características:
 * - Manejo centralizado de errores
 * - Headers por defecto
 * - Timeout configurable
 * - Transformación automática de respuestas
 * - Logging en modo desarrollo
 */

import { API_BASE_URLS, DEFAULT_HEADERS, isDevelopment } from '@/config/api.config';
import type { ApiResponse, ApiError } from '@/interfaces/api.interfaces';

/**
 * Tipo para los métodos HTTP soportados
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Opciones para configurar una petición HTTP
 */
interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Error personalizado para errores de API
 */
export class ApiRequestError extends Error {
  statusCode: number;
  response?: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Función para hacer peticiones HTTP con manejo de errores
 * 
 * @param url - URL completa del endpoint
 * @param options - Opciones de configuración (método, headers, body, etc.)
 * @returns Promise con la respuesta tipada
 * 
 * @example
 * const response = await apiRequest<ProductApiResponse[]>(
 *   'http://localhost:8083/api/products',
 *   { method: 'GET' }
 * );
 */
async function apiRequest<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000, // 30 segundos por defecto
  } = options;

  // Configurar headers
  const requestHeaders = {
    ...DEFAULT_HEADERS,
    ...headers,
  };

  // Configurar body (solo si no es GET)
  const requestBody = body && method !== 'GET' ? JSON.stringify(body) : undefined;

  // Logging en desarrollo
  if (isDevelopment) {
    console.log(`API Request: ${method} ${url}`);
    if (requestBody) {
      console.log('Body:', JSON.parse(requestBody));
    }
  }

  try {
    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Hacer la petición
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Intentar parsear la respuesta como JSON
    let data: ApiResponse<T>;
    
    try {
      data = await response.json();
    } catch {
      // Si no es JSON válido, crear respuesta de error
      throw new ApiRequestError(
        'La respuesta del servidor no es JSON válido',
        response.status,
        await response.text()
      );
    }

    // Logging en desarrollo
    if (isDevelopment) {
      console.log(`API Response (${response.status}):`, data);
    }

    // Si el status HTTP es error (4xx, 5xx), lanzar excepción
    if (!response.ok) {
      throw new ApiRequestError(
        data.message || 'Error en la petición',
        response.status,
        data
      );
    }

    return data;

  } catch (error) {
    // Manejo de errores
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiRequestError('La petición tardó demasiado (timeout)', 408);
      }

      // Error de red (backend no disponible, CORS, etc.)
      throw new ApiRequestError(
        `Error de red: ${error.message}. Verifica que el backend esté corriendo.`,
        0 // 0 indica error de red
      );
    }

    throw new ApiRequestError('Error desconocido en la petición', 500);
  }
}

/**
 * Funciones auxiliares para cada método HTTP
 */

/**
 * GET request
 */
export async function get<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'GET', headers });
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'POST', body, headers });
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  body: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'PUT', body, headers });
}

/**
 * DELETE request
 */
export async function del<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, { method: 'DELETE', headers });
}

/**
 * Objeto con todas las funciones HTTP agrupadas
 * para facilitar las importaciones
 */
export const httpClient = {
  get,
  post,
  put,
  delete: del,
};

/**
 * Funciones específicas por microservicio
 * 
 * Estas funciones pre-configuran la URL base de cada microservicio
 * para que no tengas que repetirla en cada llamada.
 */

export const productsClient = {
  get: <T>(endpoint: string) => get<T>(`${API_BASE_URLS.products}${endpoint}`),
  post: <T>(endpoint: string, body: any) => post<T>(`${API_BASE_URLS.products}${endpoint}`, body),
  put: <T>(endpoint: string, body: any) => put<T>(`${API_BASE_URLS.products}${endpoint}`, body),
  delete: <T>(endpoint: string) => del<T>(`${API_BASE_URLS.products}${endpoint}`),
};

export const usersClient = {
  get: <T>(endpoint: string) => get<T>(`${API_BASE_URLS.users}${endpoint}`),
  post: <T>(endpoint: string, body: any) => post<T>(`${API_BASE_URLS.users}${endpoint}`, body),
  put: <T>(endpoint: string, body: any) => put<T>(`${API_BASE_URLS.users}${endpoint}`, body),
  delete: <T>(endpoint: string) => del<T>(`${API_BASE_URLS.users}${endpoint}`),
};

export const geographyClient = {
  get: <T>(endpoint: string) => get<T>(`${API_BASE_URLS.geography}${endpoint}`),
  post: <T>(endpoint: string, body: any) => post<T>(`${API_BASE_URLS.geography}${endpoint}`, body),
  put: <T>(endpoint: string, body: any) => put<T>(`${API_BASE_URLS.geography}${endpoint}`, body),
  delete: <T>(endpoint: string) => del<T>(`${API_BASE_URLS.geography}${endpoint}`),
};

export const shoppingClient = {
  get: <T>(endpoint: string) => get<T>(`${API_BASE_URLS.shopping}${endpoint}`),
  post: <T>(endpoint: string, body: any) => post<T>(`${API_BASE_URLS.shopping}${endpoint}`, body),
  put: <T>(endpoint: string, body: any) => put<T>(`${API_BASE_URLS.shopping}${endpoint}`, body),
  delete: <T>(endpoint: string) => del<T>(`${API_BASE_URLS.shopping}${endpoint}`),
};
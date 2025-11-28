/**
 * Configuración centralizada de las URLs de los microservicios
 * 
 * Este archivo lee las variables de entorno y expone las URLs base
 * de cada microservicio de forma tipada y segura.
 */

interface ApiConfig {
  products: string;
  users: string;
  geography: string;
  shopping: string;
}

/**
 * URLs base de los microservicios
 * 
 * En desarrollo: localhost con diferentes puertos
 * En producción: URLs reales de los servidores
 */
export const API_BASE_URLS: ApiConfig = {
  products: import.meta.env.VITE_API_PRODUCTS_URL || 'http://localhost:8083',
  users: import.meta.env.VITE_API_USERS_URL || 'http://localhost:8081',
  geography: import.meta.env.VITE_API_GEOGRAPHY_URL || 'http://localhost:8082',
  shopping: import.meta.env.VITE_API_SHOPPING_URL || 'http://localhost:8084',
};

/**
 * Endpoints completos de cada microservicio
 * 
 * Ejemplo: API_ENDPOINTS.products.base = "http://localhost:8083/api/products"
 */
export const API_ENDPOINTS = {
  products: {
    base: `${API_BASE_URLS.products}/api/products`,
    byId: (id: number) => `${API_BASE_URLS.products}/api/products/${id}`,
    byCategory: (categoryId: number) => `${API_BASE_URLS.products}/api/products/category/${categoryId}`,
    search: (query: string) => `${API_BASE_URLS.products}/api/products/search?query=${encodeURIComponent(query)}`,
    byStatus: (statusId: number) => `${API_BASE_URLS.products}/api/products/status/${statusId}`,
  },
  categories: {
    base: `${API_BASE_URLS.products}/api/categories`,
    byId: (id: number) => `${API_BASE_URLS.products}/api/categories/${id}`,
  },
  statuses: {
    base: `${API_BASE_URLS.products}/api/statuses`,
    byId: (id: number) => `${API_BASE_URLS.products}/api/statuses/${id}`,
  },
  users: {
    base: `${API_BASE_URLS.users}/api/users`,
    byId: (id: number) => `${API_BASE_URLS.users}/api/users/${id}`,
    login: `${API_BASE_URLS.users}/api/users/login`,
  },
  roles: {
    base: `${API_BASE_URLS.users}/api/roles`,
    byId: (id: number) => `${API_BASE_URLS.users}/api/roles/${id}`,
  },
  addresses: {
    base: `${API_BASE_URLS.geography}/api/addresses`,
    byId: (id: number) => `${API_BASE_URLS.geography}/api/addresses/${id}`,
    byUser: (userId: number) => `${API_BASE_URLS.geography}/api/addresses/user/${userId}`,
  },
  regions: {
    base: `${API_BASE_URLS.geography}/api/regions`,
    byId: (id: number) => `${API_BASE_URLS.geography}/api/regions/${id}`,
  },
  comunas: {
    base: `${API_BASE_URLS.geography}/api/comunas`,
    byId: (id: number) => `${API_BASE_URLS.geography}/api/comunas/${id}`,
    byRegion: (regionId: number) => `${API_BASE_URLS.geography}/api/comunas/region/${regionId}`,
  },
  buys: {
    base: `${API_BASE_URLS.shopping}/api/buys`,
    byId: (id: number) => `${API_BASE_URLS.shopping}/api/buys/${id}`,
    byUser: (userId: number) => `${API_BASE_URLS.shopping}/api/buys/user/${userId}`,
  },
  details: {
    base: `${API_BASE_URLS.shopping}/api/details`,
    byId: (id: number) => `${API_BASE_URLS.shopping}/api/details/${id}`,
    byBuy: (buyId: number) => `${API_BASE_URLS.shopping}/api/details/buy/${buyId}`,
  },
} as const;

/**
 * Configuración de timeouts y reintentos
 */
export const API_CONFIG = {
  timeout: 10000, // 10 segundos
  retries: 3,
  retryDelay: 1000, // 1 segundo entre reintentos
} as const;

/**
 * Modo de desarrollo
 */
export const isDevelopment = import.meta.env.VITE_MODE === 'development';

/**
 * Headers por defecto para todas las peticiones
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} as const;
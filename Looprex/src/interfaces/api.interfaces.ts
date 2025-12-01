export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  count?: number;
}

/**
 * Respuesta de producto desde la API
 * 
 * IMPORTANTE: El backend retorna objetos anidados (category, status)
 * NO retorna solo IDs como el frontend actual
 */
export interface ProductApiResponse {
  productId: number;
  name: string;
  price: number;
  stock: number;
  productPhoto: string;
  description: string;
  category: {
    categoryId: number;
    name: string;
  };
  status: {
    statusId: number;
    name: string;
  };
}

/**
 * Request para crear un producto
 * El backend espera IDs, no objetos completos
 */
export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  productPhoto: string;
  description: string;
  categoryId: number;
  statusId: number;
}

/**
 * Respuesta de categoría desde la API
 */
export interface CategoryApiResponse {
  categoryId: number;
  name: string;
}

/**
 * Respuesta de estado desde la API
 */
export interface StatusApiResponse {
  statusId: number;
  name: string;
}

/**
 * Respuesta de usuario desde la API
 * 
 * IMPORTANTE: El backend retorna role como objeto anidado
 */
export interface UserApiResponse {
  userId: number;
  email: string;
  password?: string; // Solo en creación, no en respuestas
  rut: string;
  name: string;
  lastname: string;
  phone: string;
  profilePhoto: string;
  role: {
    roleId: number;
    name: string;
  };
}

/**
 * Request para login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Request para crear usuario
 */
export interface CreateUserRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  rut: string;
  role: { roleId: number };    // ← AGREGAR
  statusId: number; 
}

/**
 * Respuesta de rol desde la API
 */
export interface RoleApiResponse {
  roleId: number;
  name: string;
}

/**
 * Respuesta de dirección desde la API
 * 
 * IMPORTANTE: Tiene comuna como objeto anidado
 */
export interface AddressApiResponse {
  addressId: number;
  userId: number;
  street: string;
  number: string;
  comuna: {
    comunaId: number;
    name: string;
    regionId: number;
  };
}

/**
 * Request para crear dirección
 
export interface CreateAddressRequest {
  userId: number;
  street: string;
  number: string;
  comuna: {           // ← CAMBIO: objeto anidado
    comunaId: number;
  };
}


/**
 * Respuesta de región desde la API
 */
export interface RegionApiResponse {
  regionId: number;
  name: string;
}

/**
 * Respuesta de comuna desde la API
 */
export interface ComunaApiResponse {
  comunaId: number;
  name: string;
  regionId: number;
}

/**
 * Respuesta de compra (Buy) desde la API
 * 
 */
export interface BuyApiResponse {
  buyId: number;
  userId: number;
  addressId: number;
  statusId: number;
  date: string; // ISO format: "2025-01-15T10:30:00"
  total: number;
}

/**
 * Request para crear compra (Buy)
 */
export interface CreateBuyRequest {
  orderNumber: string;
  buyDate: number;
  subtotal: number;
  iva: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  statusId: number;
  addressId: number;
  userId: number;
}

export interface CreateDetailRequest {
  buyId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Respuesta de detalle (Detail) desde la API
 * 
 */
export interface DetailApiResponse {
  detailId: number;
  buyId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number; 
}

/**
 * Request para crear detalle (Detail)
 */
export interface CreateDetailRequest {
  buyId: number;
  productId: number;
  quantity: number;
  unitPrice: number; 
  subtotal: number;
}

/**
 * Tipos de errores personalizados
 */
export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Configuración de opciones para requests
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}
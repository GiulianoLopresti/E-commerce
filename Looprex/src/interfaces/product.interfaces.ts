/**
 * Interfaces de Productos
 */

/**
 * Estructura de un producto (coincide con ProductApiResponse del backend)
 */
export interface ProductProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
  productPhoto: string;
  description: string;
  // Objetos anidados (como vienen del backend)
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
 * Request para crear/actualizar producto (sin objetos anidados)
 */
export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
  productPhoto: string;
  description: string;
  categoryId: number;  // Solo ID
  statusId: number;    // Solo ID
}

/**
 * Respuesta al obtener todos los productos
 */
export interface ProductsAllProps {
  ok: boolean;
  statusCode: number;
  products: ProductProps[];
}

/**
 * Respuesta al obtener un producto por ID
 */
export interface ProductByIdProps {
  ok: boolean;
  statusCode: number;
  product: ProductProps | null;
}

/**
 * Respuesta al crear/actualizar/eliminar producto
 */
export interface ProductMutationProps {
  ok: boolean;
  statusCode: number;
  message: string;
  product?: ProductProps;
}
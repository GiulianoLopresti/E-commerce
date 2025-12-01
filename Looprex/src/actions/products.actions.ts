/**
 * Actions de Productos
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { ProductsService } from '@/services';
import type { ProductsAllProps, ProductByIdProps, ProductMutationProps } from '@/interfaces';

/**
 * Obtener todos los productos
 */
export const getProducts = async (): Promise<ProductsAllProps> => {
  try {
    const response = await ProductsService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        products: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      products: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener productos:', error);
    return {
      ok: false,
      statusCode: 500,
      products: [],
    };
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: number): Promise<ProductByIdProps> => {
  try {
    const response = await ProductsService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        product: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      product: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener producto:', error);
    return {
      ok: false,
      statusCode: 500,
      product: null,
    };
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (categoryId: number): Promise<ProductsAllProps> => {
  try {
    const response = await ProductsService.getByCategory(categoryId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        products: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      products: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener productos por categoría:', error);
    return {
      ok: false,
      statusCode: 500,
      products: [],
    };
  }
};

/**
 * Buscar productos por nombre
 */
export const searchProducts = async (query: string): Promise<ProductsAllProps> => {
  try {
    const response = await ProductsService.search(query);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        products: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      products: response.data,
    };
  } catch (error: any) {
    console.error('Error al buscar productos:', error);
    return {
      ok: false,
      statusCode: 500,
      products: [],
    };
  }
};

/**
 * Obtener productos por estado
 */
export const getProductsByStatus = async (statusId: number): Promise<ProductsAllProps> => {
  try {
    const response = await ProductsService.getByStatus(statusId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        products: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      products: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener productos por estado:', error);
    return {
      ok: false,
      statusCode: 500,
      products: [],
    };
  }
};

/**
 * Crear un producto (ADMIN)
 */
export const createProduct = async (productData: {
  name: string;
  price: number;
  stock: number;
  productPhoto: string;
  description: string;
  categoryId: number;
  statusId: number;
}): Promise<ProductMutationProps> => {
  try {
    const response = await ProductsService.create(productData);
    
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
      message: response.message,
      product: response.data,
    };
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al crear el producto',
    };
  }
};

/**
 * Actualizar un producto (ADMIN)
 */
export const updateProduct = async (
  id: number,
  productData: {
    name: string;
    price: number;
    stock: number;
    productPhoto: string;
    description: string;
    categoryId: number;
    statusId: number;
  }
): Promise<ProductMutationProps> => {
  try {
    const response = await ProductsService.update(id, productData);
    
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
      message: response.message,
      product: response.data,
    };
  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al actualizar el producto',
    };
  }
};

/**
 * Eliminar un producto (ADMIN)
 */
export const deleteProduct = async (id: number): Promise<ProductMutationProps> => {
  try {
    const response = await ProductsService.delete(id);
    
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
      message: 'Producto eliminado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al eliminar el producto',
    };
  }
};

/**
 * Reducir stock de un producto
 */
export const reduceProductStock = async (productId: number, quantity: number): Promise<boolean> => {
  try {
    // Primero obtener el producto actual
    const productResponse = await getProductById(productId);
    
    if (!productResponse.ok || !productResponse.product) {
      return false;
    }

    const product = productResponse.product;
    const newStock = product.stock - quantity;

    if (newStock < 0) {
      console.error(`Stock insuficiente para producto ${productId}`);
      return false;
    }

    const updateData = {
      name: product.name,
      description: product.description,
      price: product.price,
      productPhoto: product.productPhoto,
      stock: newStock, 
      categoryId: product.category.categoryId,
      statusId: product.status.statusId
    };

    const response = await ProductsService.update(productId, updateData);
    return response.success;
    
  } catch (error) {
    console.error('Error al reducir stock:', error);
    return false;
  }
};
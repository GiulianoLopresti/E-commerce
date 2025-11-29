/**
 * Actions de Categorías
 * ACTUALIZADO: Ahora usa servicios API reales en vez de mocks
 */

import { CategoriesService } from '@/services';
import type { CategoriesAllProps, CategoryByIdProps, CategoryMutationProps } from '@/interfaces';

/**
 * Obtener todas las categorías
 */
export const getCategories = async (): Promise<CategoriesAllProps> => {
  try {
    const response = await CategoriesService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        categories: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      categories: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    return {
      ok: false,
      statusCode: 500,
      categories: [],
    };
  }
};

/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id: number): Promise<CategoryByIdProps> => {
  try {
    const response = await CategoriesService.getById(id);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        category: null,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      category: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener categoría:', error);
    return {
      ok: false,
      statusCode: 500,
      category: null,
    };
  }
};

/**
 * Crear una categoría (ADMIN)
 */
export const createCategory = async (name: string): Promise<CategoryMutationProps> => {
  try {
    const response = await CategoriesService.create(name);
    
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
      category: response.data,
    };
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al crear la categoría',
    };
  }
};

/**
 * Actualizar una categoría (ADMIN)
 */
export const updateCategory = async (id: number, name: string): Promise<CategoryMutationProps> => {
  try {
    const response = await CategoriesService.update(id, name);
    
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
      category: response.data,
    };
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al actualizar la categoría',
    };
  }
};

/**
 * Eliminar una categoría (ADMIN)
 */
export const deleteCategory = async (id: number): Promise<CategoryMutationProps> => {
  try {
    const response = await CategoriesService.delete(id);
    
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
      message: 'Categoría eliminada exitosamente',
    };
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al eliminar la categoría',
    };
  }
};
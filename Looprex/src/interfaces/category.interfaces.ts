/**
 * Interfaces de Categorías
 */

/**
 * Estructura de una categoría
 */
export interface CategoryProps {
  categoryId: number;
  name: string;
}

/**
 * Respuesta al obtener todas las categorías
 */
export interface CategoriesAllProps {
  ok: boolean;
  statusCode: number;
  categories: CategoryProps[];
}

/**
 * Respuesta al obtener una categoría por ID
 */
export interface CategoryByIdProps {
  ok: boolean;
  statusCode: number;
  category: CategoryProps | null;
}

/**
 * Respuesta al crear/actualizar/eliminar categoría
 */
export interface CategoryMutationProps {
  ok: boolean;
  statusCode: number;
  message: string;
  category?: CategoryProps;
}
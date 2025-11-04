import { CATEGORIES } from '../mocks';
import type { 
  CategoryProps,
  CategoriesAllProps,
  CategoryResponseProps,
  CategoryDeleteProps
} from '../interfaces';

// (Admin)
/** (READ) Simula la obtención de TODAS las categorías */
export const getCategories = (): CategoriesAllProps => {
  return { ok: true, statusCode: 200, categories: CATEGORIES };
};

// (Admin)
/** (CREATE) Simula la creación de una nueva categoría */
type CreateCategoryData = Omit<CategoryProps, 'categoryId'>;
export const createCategory = (data: CreateCategoryData): CategoryResponseProps => {
  const newCategory: CategoryProps = {
    ...data,
    categoryId: Math.floor(Math.random() * 100) + 10
  };
  return { ok: true, statusCode: 201, category: newCategory };
};

// (Admin)
/** (UPDATE) Simula la actualización de una categoría */
export const updateCategory = (categoryId: number, data: Partial<CategoryProps>): CategoryResponseProps => {
  const category = CATEGORIES.find(c => c.categoryId === categoryId);
  if (category) {
    const updatedCategory = { ...category, ...data };
    return { ok: true, statusCode: 200, category: updatedCategory };
  }
  return { ok: false, statusCode: 404, category: {} as CategoryProps };
};

// (Admin)
/** (DELETE) Simula la eliminación de una categoría */
export const deleteCategory = (): CategoryDeleteProps => {
  return { ok: true, statusCode: 200, message: 'Categoría eliminada' };
};
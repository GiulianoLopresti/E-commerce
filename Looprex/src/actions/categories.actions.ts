import { CATEGORIES } from '../mocks';
import type { 
  CategoryProps,
  CategoriesAllProps,
  CategoryResponseProps,
  CategoryDeleteProps
} from '../interfaces';

// (Admin)
/** (READ) Simula la obtención de TODAS las categorías */
export const getCategories = async (): Promise<CategoriesAllProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, categories: CATEGORIES });
    }, 100);
  });
};

// (Admin)
/** (CREATE) Simula la creación de una nueva categoría */
type CreateCategoryData = Omit<CategoryProps, 'idCategory'>;
export const createCategory = async (data: CreateCategoryData): Promise<CategoryResponseProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newCategory: CategoryProps = {
        ...data,
        categoryId: Math.floor(Math.random() * 100) + 10
      };
      resolve({ ok: true, statusCode: 201, category: newCategory });
    }, 500);
  });
};

// (Admin)
/** (UPDATE) Simula la actualización de una categoría */
export const updateCategory = async (categoryId: number, data: Partial<CategoryProps>): Promise<CategoryResponseProps> => {
  return new Promise(resolve => {
    const category = CATEGORIES.find(c => c.categoryId === categoryId);
    if (category) {
      const updatedCategory = { ...category, ...data };
      resolve({ ok: true, statusCode: 200, category: updatedCategory });
    } else {
      resolve({ ok: false, statusCode: 404, category: {} as CategoryProps });
    }
  });
};

// (Admin)
/** (DELETE) Simula la eliminación de una categoría */
export const deleteCategory = async (): Promise<CategoryDeleteProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, message: 'Categoría eliminada' });
    }, 500);
  });
};
import { CATEGORIES } from '../mocks';
import type {
  CategoryProps,
  CategoriesAllProps,
  CategoryResponseProps,
  CategoryDeleteProps
} from '../interfaces';

let CATEGORIES_STATE: CategoryProps[] = [...CATEGORIES];

const cloneCategory = (category: CategoryProps): CategoryProps => ({ ...category });

const getNextCategoryId = (): number => {
  if (CATEGORIES_STATE.length === 0) {
    return 1;
  }
  return Math.max(...CATEGORIES_STATE.map(category => category.categoryId)) + 1;
};

// (Admin)
/** (READ) Obtiene TODAS las categorías */
export const getCategories = (): CategoriesAllProps => {
  return {
    ok: true,
    statusCode: 200,
    categories: CATEGORIES_STATE.map(cloneCategory)
  };
};

// (Admin)
/** (CREATE) Crea una nueva categoría */
type CreateCategoryData = Omit<CategoryProps, 'categoryId'>;
export const createCategory = (data: CreateCategoryData): CategoryResponseProps => {
  const newCategory: CategoryProps = {
    ...data,
    categoryId: getNextCategoryId()
  };
  CATEGORIES_STATE = [...CATEGORIES_STATE, newCategory];
  return { ok: true, statusCode: 201, category: cloneCategory(newCategory) };
};

// (Admin)
/** (UPDATE) Actualiza una categoría */
export const updateCategory = (categoryId: number, data: Partial<CategoryProps>): CategoryResponseProps => {
  const categoryIndex = CATEGORIES_STATE.findIndex(c => c.categoryId === categoryId);
  if (categoryIndex !== -1) {
    const updatedCategory: CategoryProps = {
      ...CATEGORIES_STATE[categoryIndex],
      ...data,
      categoryId: CATEGORIES_STATE[categoryIndex].categoryId
    };
    CATEGORIES_STATE = [
      ...CATEGORIES_STATE.slice(0, categoryIndex),
      updatedCategory,
      ...CATEGORIES_STATE.slice(categoryIndex + 1)
    ];
    return { ok: true, statusCode: 200, category: cloneCategory(updatedCategory) };
  }
  return { ok: false, statusCode: 404, category: {} as CategoryProps };
};

// (Admin)
/** (DELETE) Elimina una categoría */
export const deleteCategory = (categoryId: number): CategoryDeleteProps => {
  const initialLength = CATEGORIES_STATE.length;
  CATEGORIES_STATE = CATEGORIES_STATE.filter(category => category.categoryId !== categoryId);
  if (CATEGORIES_STATE.length === initialLength) {
    return { ok: false, statusCode: 404, message: 'Categoría no encontrada' };
  }
  return { ok: true, statusCode: 200, message: 'Categoría eliminada' };
};
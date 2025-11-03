import { storage, STORAGE_KEYS } from '../actions/persistence';
import type { Category } from '../interfaces/category.interfaces';
import { INITIAL_CATEGORIES } from '../mocks/categories';

let CATEGORIES: Category[] = storage.get<Category[]>(STORAGE_KEYS.CATEGORIES) || INITIAL_CATEGORIES;
const saveCategories = () => storage.set(STORAGE_KEYS.CATEGORIES, CATEGORIES);

// READ
export const getCategories = (): Promise<Category[]> => {
  return Promise.resolve([...CATEGORIES]);
};

export const getCategoryById = (id: number): Promise<Category | null> => {
  const category = CATEGORIES.find(c => c.id === id);
  return Promise.resolve(category || null);
};

// CREATE
export const createCategory = (data: Omit<Category, 'id'>): Promise<Category> => {
  const newCategory: Category = {
    ...data,
    id: Math.max(...CATEGORIES.map(c => c.id), 0) + 1
  };
  CATEGORIES.push(newCategory);
  saveCategories();
  return Promise.resolve(newCategory);
};

// UPDATE
export const updateCategory = (id: number, data: Partial<Category>): Promise<Category | null> => {
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) return Promise.resolve(null);

  CATEGORIES[index] = { ...CATEGORIES[index], ...data };
  saveCategories();
  return Promise.resolve(CATEGORIES[index]);
};

// DELETE
export const deleteCategory = (id: number): Promise<boolean> => {
  const index = CATEGORIES.findIndex(c => c.id === id);
  if (index === -1) return Promise.resolve(false);

  CATEGORIES.splice(index, 1);
  saveCategories();
  return Promise.resolve(true);
};
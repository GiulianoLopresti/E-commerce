import { storage, STORAGE_KEYS } from './persistence';
import { INITIAL_PRODUCTS } from '../mocks/products.data';
import type { Product } from '../interfaces/product.interfaces';

let PRODUCTS: Product[] = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS) || INITIAL_PRODUCTS;

const saveProducts = () => {
  storage.set(STORAGE_KEYS.PRODUCTS, PRODUCTS);
};

// READ
export const getProducts = (): Promise<Product[]> => {
  return Promise.resolve([...PRODUCTS]);
};

export const getProductById = (id: number): Promise<Product | null> => {
  const product = PRODUCTS.find(p => p.id === id);
  return Promise.resolve(product || null);
};

export const getProductsByCategory = (categoryId: number): Promise<Product[]> => {
  const filtered = PRODUCTS.filter(p => p.categoryId === categoryId);
  return Promise.resolve([...filtered]);
};

// CREATE
export const createProduct = (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  const newProduct: Product = {
    ...data,
    id: Math.max(...PRODUCTS.map(p => p.id), 0) + 1,
    createdAt: new Date().toISOString()
  };
  PRODUCTS.push(newProduct);
  saveProducts();
  return Promise.resolve(newProduct);
};

// UPDATE
export const updateProduct = (id: number, data: Partial<Product>): Promise<Product | null> => {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) return Promise.resolve(null);
  
  PRODUCTS[index] = { ...PRODUCTS[index], ...data };
  saveProducts();
  return Promise.resolve(PRODUCTS[index]);
};

// DELETE
export const deleteProduct = (id: number): Promise<boolean> => {
  const index = PRODUCTS.findIndex(p => p.id === id);
  if (index === -1) return Promise.resolve(false);
  
  PRODUCTS.splice(index, 1);
  saveProducts();
  return Promise.resolve(true);
};
import { PRODUCTS } from '../mocks';
import type { 
  ProductProps,
  ProductsAllProps, 
  ProductByIdProps,
  ProductsByNameProps,
  ProductResponseProps,
  ProductDeleteProps
} from '../interfaces';

// (Cliente & Admin)
/** (READ) Simula la obtención de TODOS los productos */
export const getProducts = (): ProductsAllProps => {
  return { ok: true, statusCode: 200, products: PRODUCTS };
};

// (Cliente & Admin)
/** (READ) Obtiene un producto por su ID */
export const getProductById = (id: number): ProductByIdProps => {
  const product = PRODUCTS.find(p => p.productId === id);
  if (product) {
    return { ok: true, statusCode: 200, product };
  }
  return { ok: false, statusCode: 404 };
};

// (Cliente & Admin)
/** (READ) Busca productos por nombre */
export const getProductsByName = (query: string): ProductsByNameProps => {
  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery === '') {
    return { ok: true, statusCode: 200, products: [] };
  }
  const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerQuery));
  return { ok: true, statusCode: 200, products: results };
};

// (Admin)
/** (CREATE) Crea un nuevo producto */
type CreateProductData = Omit<ProductProps, 'productId'>;
export const createProduct = (data: CreateProductData): ProductResponseProps => {
  const newProduct: ProductProps = {
    ...data,
    productId: Math.floor(Math.random() * 1000) + 100 // ID aleatorio
  };
  return { ok: true, statusCode: 201, product: newProduct };
};

// (Admin)
/** (UPDATE) Actualiza un producto */
export const updateProduct = (id: number, data: Partial<ProductProps>): ProductResponseProps => {
  const product = PRODUCTS.find(p => p.productId === id);
  if (product) {
    const updatedProduct = { ...product, ...data };
    return { ok: true, statusCode: 200, product: updatedProduct };
  }
  return { ok: false, statusCode: 404, product: {} as ProductProps };
};

// (Admin)
/** (DELETE) Elimina un producto */
export const deleteProduct = (): ProductDeleteProps => {
  return { ok: true, statusCode: 200, message: 'Producto eliminado exitosamente' };
};
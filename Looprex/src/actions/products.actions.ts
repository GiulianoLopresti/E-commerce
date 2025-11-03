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
export const getProducts = async (): Promise<ProductsAllProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, products: PRODUCTS });
    }, 300);
  });
};

// (Cliente & Admin)
/** (READ) Simula la obtención de un producto por su ID */
export const getProductById = async (id: number): Promise<ProductByIdProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const product = PRODUCTS.find(p => p.idProduct === id);
      if (product) {
        resolve({ ok: true, statusCode: 200, product: product });
      } else {
        resolve({ ok: false, statusCode: 404 });
      }
    }, 200);
  });
};

// (Cliente & Admin)
/** (READ) Simula la búsqueda de productos por nombre */
export const getProductsByName = async (query: string): Promise<ProductsByNameProps> => {
  const lowerQuery = query.toLowerCase().trim();
  if (lowerQuery === '') {
    return { ok: true, statusCode: 200, products: [] };
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerQuery));
      resolve({ ok: true, statusCode: 200, products: results });
    }, 400);
  });
};

// (Admin)
/** (CREATE) Simula la creación de un nuevo producto */
type CreateProductData = Omit<ProductProps, 'idProduct'>;
export const createProduct = async (data: CreateProductData): Promise<ProductResponseProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newProduct: ProductProps = {
        ...data,
        idProduct: Math.floor(Math.random() * 1000) + 100 // ID aleatorio
      };
      // Simulación: No modificamos el mock, solo devolvemos la respuesta.
      resolve({ ok: true, statusCode: 201, product: newProduct });
    }, 500);
  });
};

// (Admin)
/** (UPDATE) Simula la actualización de un producto */
export const updateProduct = async (id: number, data: Partial<ProductProps>): Promise<ProductResponseProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const product = PRODUCTS.find(p => p.idProduct === id);
      if (product) {
        const updatedProduct = { ...product, ...data };
        resolve({ ok: true, statusCode: 200, product: updatedProduct });
      } else {
        resolve({ ok: false, statusCode: 404, product: {} as ProductProps }); 
      }
    }, 500);
  });
};

// (Admin)
/** (DELETE) Simula la eliminación de un producto */
export const deleteProduct = async (): Promise<ProductDeleteProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, message: 'Producto eliminado exitosamente' });
    }, 500);
  });
};
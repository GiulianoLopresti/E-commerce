import { PRODUCTS } from '../mocks';
import type {
  ProductProps,
  ProductsAllProps,
  ProductByIdProps,
  ProductsByNameProps,
  ProductResponseProps,
  ProductDeleteProps
} from '../interfaces';

let PRODUCTS_STATE: ProductProps[] = [...PRODUCTS];

const cloneProduct = (product: ProductProps): ProductProps => ({ ...product });

const getNextProductId = (): number => {
  if (PRODUCTS_STATE.length === 0) {
    return 1;
  }
  return Math.max(...PRODUCTS_STATE.map(product => product.productId)) + 1;
};

// (Cliente & Admin)
/** (READ) Obtiene TODOS los productos */
export const getProducts = (): ProductsAllProps => {
  return {
    ok: true,
    statusCode: 200,
    products: PRODUCTS_STATE.map(cloneProduct)
  };
};

// (Cliente & Admin)
/** (READ) Obtiene un producto por su ID */
export const getProductById = (id: number): ProductByIdProps => {
  const product = PRODUCTS_STATE.find(p => p.productId === id);
  if (product) {
    return { ok: true, statusCode: 200, product: cloneProduct(product) };
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
  const results = PRODUCTS_STATE.filter(p => p.name.toLowerCase().includes(lowerQuery));
  return {
    ok: true,
    statusCode: 200,
    products: results.map(cloneProduct)
  };
};

// (Admin)
/** (CREATE) Crea un nuevo producto */
type CreateProductData = Omit<ProductProps, 'productId'>;
export const createProduct = (data: CreateProductData): ProductResponseProps => {

  const newProduct: ProductProps = {
    ...data,
    productId: getNextProductId()
  };

  PRODUCTS_STATE = [...PRODUCTS_STATE, newProduct];

  return { ok: true, statusCode: 201, product: cloneProduct(newProduct) };
};

// (Admin)
/** (UPDATE) Actualiza un producto */
export const updateProduct = (id: number, data: Partial<ProductProps>): ProductResponseProps => {

  const productIndex = PRODUCTS_STATE.findIndex(p => p.productId === id);

  if (productIndex !== -1) {

    const updatedProduct: ProductProps = {
      ...PRODUCTS_STATE[productIndex],
      ...data,
      productId: PRODUCTS_STATE[productIndex].productId
    };

    PRODUCTS_STATE = [
      ...PRODUCTS_STATE.slice(0, productIndex),
      updatedProduct,
      ...PRODUCTS_STATE.slice(productIndex + 1)
    ];

    return { ok: true, statusCode: 200, product: cloneProduct(updatedProduct) };

  }

  return { ok: false, statusCode: 404, product: {} as ProductProps };
};

// (Admin)
/** (DELETE) Elimina un producto */
export const deleteProduct = (productId: number): ProductDeleteProps => {

  const initialLength = PRODUCTS_STATE.length;

  PRODUCTS_STATE = PRODUCTS_STATE.filter(p => p.productId !== productId);

  if (PRODUCTS_STATE.length === initialLength) {
    return { ok: false, statusCode: 404, message: 'Producto no encontrado' };
  }
  
  return { ok: true, statusCode: 200, message: 'Producto eliminado exitosamente' };
};
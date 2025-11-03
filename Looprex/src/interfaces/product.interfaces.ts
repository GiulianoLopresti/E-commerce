/** Interface que representa un producto */
export interface ProductProps {
  idProduct: number;
  name: string;
  stock: number;
  productPhoto: string;
  description: string;
  price: number;        
  idCategory: number;
  idStatus: number;
}

export interface ProductsAllProps {
  ok: boolean;
  statusCode: number;
  products: ProductProps[];
}

export interface ProductByIdProps {
  ok: boolean;
  statusCode: number;
  product?: ProductProps;
}

export interface ProductsByNameProps {
  ok: boolean;
  statusCode: number;
  products: ProductProps[];
}

export interface ProductResponseProps {
  ok: boolean;
  statusCode: number;
  product: ProductProps;
}

export interface ProductDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}
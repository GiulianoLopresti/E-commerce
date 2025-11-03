export interface CategoryProps {
  idCategory: number;
  name: string;
}

export interface CategoriesAllProps {
  ok: boolean;
  statusCode: number;
  categories: CategoryProps[];
}

export interface CategoryByIdProps {
  ok: boolean;
  statusCode: number;
  category?: CategoryProps;
}

export interface CategoryResponseProps {
  ok: boolean;
  statusCode: number;
  category: CategoryProps;
}

export interface CategoryDeleteProps {
  ok: boolean;
  statusCode: number;
  message: string;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  categoryId: number;
  statusId: number;
  createdAt: string;
}
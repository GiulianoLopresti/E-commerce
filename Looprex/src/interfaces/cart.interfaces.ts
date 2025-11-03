import type { ProductProps } from './product.interfaces';

// An item in the cart is a Product + a quantity
export interface CartItemProps extends ProductProps {
  quantity: number;
}
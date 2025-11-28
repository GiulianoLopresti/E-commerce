import type { DetailProps } from './detail.interfaces';

export interface BuyProps {
  orderId: number;
  orderNumber: string;   
  purchaseDate: string; 
  subtotal: number;
  iva: number;          
  shipping: number;     
  total: number;
  paymentMethod: string;
  addressId: number;
  statusId: number;
  userId: number;
  details: DetailProps[];
}

/** Para la acción getOrdersByUserId() */
export interface OrdersByUserProps {
  ok: boolean;
  statusCode: number;
  orders: BuyProps[];
}

/** Para la acción createOrder() */
export interface OrderCreateProps {
  ok: boolean;
  statusCode: number; // 201 (Created)
  order: BuyProps; // Devuelve la orden recién creada
}

/** Para la acción updateOrderStatus() */
export interface OrderUpdateProps {
  ok: boolean;
  statusCode: number; // 200 (OK)
  order: BuyProps; // Devuelve la orden actualizada
}
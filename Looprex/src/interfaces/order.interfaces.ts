import type { OrderDetailProps } from '../interfaces/orderDetail.interfaces';

export interface OrderProps {
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
  details: OrderDetailProps[];
}

/** Para la acción getOrdersByUserId() */
export interface OrdersByUserProps {
  ok: boolean;
  statusCode: number;
  orders: OrderProps[];
}

/** Para la acción createOrder() */
export interface OrderCreateProps {
  ok: boolean;
  statusCode: number; // 201 (Created)
  order: OrderProps; // Devuelve la orden recién creada
}

/** Para la acción updateOrderStatus() */
export interface OrderUpdateProps {
  ok: boolean;
  statusCode: number; // 200 (OK)
  order: OrderProps; // Devuelve la orden actualizada
}
import type { OrderDetailProps } from '../interfaces/orderDetail.interfaces';

export interface OrderProps {
  idOrder: number;
  orderNumber: string;   
  purchaseDate: string; 
  subtotal: number;
  iva: number;          
  shipping: number;     
  total: number;
  paymentMethod: string;
  idAddress: number;
  idStatus: number;
  idUser: number;
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
  statusCode: number; // Debería ser 201 (Created)
  order: OrderProps; // Devuelve la orden recién creada
}
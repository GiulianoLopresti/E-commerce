export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  addressId: number;
  statusId: number;
  paymentMethod: 'TRANSFER' | 'CARD';
  subtotal: number;
  iva: number;
  shipping: number;
  total: number;
  createdAt: string;
  orderDate: Date;
}
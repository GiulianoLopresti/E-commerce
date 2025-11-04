import { ORDERS, PRODUCTS } from '../mocks';

import type {
  OrderProps,
  OrdersByUserProps,
  OrderCreateProps,
  OrderUpdateProps,
  CartItem,
  UserProps,
  OrderDetailProps
} from '../interfaces';

// (Cliente)
/** (CREATE) Simula la creación de una nueva Orden (Checkout) */
export const createOrder = (
  cartItems: CartItem[],
  user: UserProps,
  addressId: number
): OrderCreateProps => {
  let calculatedSubtotal = 0;
  const details: OrderDetailProps[] = [];

  for (const item of cartItems) {
    const product = PRODUCTS.find(p => p.productId === item.productId);

    if (!product) {
      throw new Error(`El producto con ID ${item.productId} no fue encontrado.`);
    }

    const itemSubtotal = product.price * item.quantity;
    calculatedSubtotal += itemSubtotal;

    details.push({
      detailId: Math.floor(Math.random() * 10000),
      orderId: 0,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: itemSubtotal,
    });
  }

  const iva = calculatedSubtotal * 0.19;
  const shipping = calculatedSubtotal > 50000 ? 0 : 4990;
  const total = calculatedSubtotal + iva + shipping;

  const newOrder: OrderProps = {
    orderId: 999,
    orderNumber: `LPX-${Math.floor(Math.random() * 90000) + 10000}`,
    purchaseDate: new Date().toISOString(),
    subtotal: calculatedSubtotal,
    iva,
    shipping,
    total,
    paymentMethod: 'Transbank (Simulado)',
    addressId: addressId,
    statusId: 10,
    userId: user.userId,
    details
  };

  for (const detail of newOrder.details) {
    detail.orderId = newOrder.orderId;
  }

  return { ok: true, statusCode: 201, order: newOrder };
};

// (Cliente)
/** (READ) Obtiene las Órdenes para un usuario específico */
export const getOrdersByUserId = (userId: number): OrdersByUserProps => {
  const orders = ORDERS.filter(o => o.userId === userId);
  return { ok: true, statusCode: 200, orders };
};

// (Admin)
/** (READ) Obtiene TODAS las órdenes (para admin) */
export const getAllOrders = (): OrdersByUserProps => {
  return { ok: true, statusCode: 200, orders: ORDERS };
};

// (Admin)
/** (UPDATE) Actualiza el estado de una orden */
export const updateOrderStatus = (orderId: number, statusId: number): OrderUpdateProps => {
  const order = ORDERS.find(o => o.orderId === orderId);
  if (order) {
    const updatedOrder = { ...order, statusId };
    return { ok: true, statusCode: 200, order: updatedOrder };
  }
  return { ok: false, statusCode: 404, order: {} as OrderProps };
};
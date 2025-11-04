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

const cloneOrderDetail = (detail: OrderDetailProps): OrderDetailProps => ({ ...detail });
const cloneOrder = (order: OrderProps): OrderProps => ({
  ...order,
  details: order.details.map(cloneOrderDetail)
});

let ORDERS_STATE: OrderProps[] = ORDERS.map(cloneOrder);

const getNextOrderId = (): number => {
  if (ORDERS_STATE.length === 0) {
    return 1;
  }
  return Math.max(...ORDERS_STATE.map(order => order.orderId)) + 1;
};

const getNextOrderDetailId = (): number => {
  const details = ORDERS_STATE.flatMap(order => order.details);
  if (details.length === 0) {
    return 1;
  }
  return Math.max(...details.map(detail => detail.detailId)) + 1;
};

const generateOrderNumber = (orderId: number): string => `LPX-${String(orderId).padStart(5, '0')}`;

// (Cliente)
/** (CREATE) Crea una nueva Orden (Checkout) */
export const createOrder = (
  cartItems: CartItem[],
  user: UserProps,
  addressId: number
): OrderCreateProps => {
  let calculatedSubtotal = 0;
  const details: OrderDetailProps[] = [];
  let nextDetailId = getNextOrderDetailId();

  for (const item of cartItems) {
    const product = PRODUCTS.find(p => p.productId === item.productId);

    if (!product) {
      throw new Error(`El producto con ID ${item.productId} no fue encontrado.`);
    }

    const itemSubtotal = product.price * item.quantity;
    calculatedSubtotal += itemSubtotal;

    details.push({
      detailId: nextDetailId,
      orderId: 0,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: itemSubtotal
    });
    nextDetailId += 1;
  }

  const iva = calculatedSubtotal * 0.19;
  const shipping = calculatedSubtotal > 50000 ? 0 : 4990;
  const total = calculatedSubtotal + iva + shipping;

  const newOrderId = getNextOrderId();
  const newOrder: OrderProps = {
    orderId: newOrderId,
    orderNumber: generateOrderNumber(newOrderId),
    purchaseDate: new Date().toISOString(),
    subtotal: calculatedSubtotal,
    iva,
    shipping,
    total,
    paymentMethod: 'Transbank (Simulado)',
    addressId,
    statusId: 10,
    userId: user.userId,
    details: details.map(detail => ({ ...detail, orderId: newOrderId }))
  };

  ORDERS_STATE = [...ORDERS_STATE, newOrder];

  return { ok: true, statusCode: 201, order: cloneOrder(newOrder) };
};

// (Cliente)
/** (READ) Obtiene las Órdenes para un usuario específico */
export const getOrdersByUserId = (userId: number): OrdersByUserProps => {
  const orders = ORDERS_STATE.filter(o => o.userId === userId).map(cloneOrder);
  return { ok: true, statusCode: 200, orders };
};

// (Admin)
/** (READ) Obtiene TODAS las órdenes (para admin) */
export const getAllOrders = (): OrdersByUserProps => {
  return { ok: true, statusCode: 200, orders: ORDERS_STATE.map(cloneOrder) };
};

// (Admin)
/** (UPDATE) Actualiza el estado de una orden */
export const updateOrderStatus = (orderId: number, statusId: number): OrderUpdateProps => {
  const orderIndex = ORDERS_STATE.findIndex(o => o.orderId === orderId);
  if (orderIndex !== -1) {
    const updatedOrder: OrderProps = {
      ...ORDERS_STATE[orderIndex],
      statusId
    };
    ORDERS_STATE = [
      ...ORDERS_STATE.slice(0, orderIndex),
      updatedOrder,
      ...ORDERS_STATE.slice(orderIndex + 1)
    ];
    return { ok: true, statusCode: 200, order: cloneOrder(updatedOrder) };
  }
  return { ok: false, statusCode: 404, order: {} as OrderProps };
};
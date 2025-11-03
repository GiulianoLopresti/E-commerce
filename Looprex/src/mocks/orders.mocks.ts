import type { OrderProps, OrderDetailProps } from '../interfaces';

// --- DETALLES DE ÓRDENES ---
// (Conectados a idProduct de products.mocks.ts)
const DETAILS_ORDER_901: OrderDetailProps[] = [
  {
    detailId: 1001,
    orderId: 901,
    productId: 1, // Procesador AMD Ryzen 5
    quantity: 1,
    unitPrice: 219990,
    subtotal: 219990
  },
  {
    detailId: 1002,
    orderId: 901,
    productId: 3, // Mouse Logitech G502
    quantity: 1,
    unitPrice: 49990,
    subtotal: 49990
  }
];

const DETAILS_ORDER_902: OrderDetailProps[] = [
  {
    detailId: 1003,
    orderId: 902,
    productId: 5, // Monitor Xiaomi
    quantity: 1,
    unitPrice: 249990,
    subtotal: 249990
  }
];

export const ORDER_DETAILS: OrderDetailProps[] = [
  ...DETAILS_ORDER_901,
  ...DETAILS_ORDER_902
];

// --- ÓRDENES (COMPRAS) ---
// (Conectadas a idUser, idAddress, idStatus y los detalles de arriba)
export const ORDERS: OrderProps[] = [
  {
    orderId: 901,
    orderNumber: 'LPX-10001',
    purchaseDate: '2025-10-20T10:30:00Z',
    subtotal: 269980,
    iva: 51296, // 19% de 269980
    shipping: 0, // Envío gratis
    total: 321276,
    paymentMethod: 'Webpay',
    addressId: 501, // Dirección de Juan Pérez
    statusId: 13,   // Entregado
    userId: 2,      // Usuario Juan Pérez
    details: DETAILS_ORDER_901 // Array de detalles
  },
  {
    orderId: 902,
    orderNumber: 'LPX-10002',
    purchaseDate: '2025-10-28T14:00:00Z',
    subtotal: 249990,
    iva: 47498,
    shipping: 0,
    total: 297488,
    paymentMethod: 'Transferencia',
    addressId: 502, // Dirección de María González
    statusId: 12,   // Enviado
    userId: 3,      // Usuario María González
    details: DETAILS_ORDER_902
  }
];
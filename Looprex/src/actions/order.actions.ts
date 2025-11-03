import { ORDERS, PRODUCTS } from '../mocks'; // <-- Solo importamos ORDERS
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
export const createOrder = async (
  cartItems: CartItem[], 
  user: UserProps, 
  addressId: number
): Promise<OrderCreateProps> => {
  return new Promise((resolve, reject) => {
    // Lógica de cálculo
    let calculatedSubtotal = 0;
    const details: OrderDetailProps[] = [];

    for (const item of cartItems) {
      // 1. Buscamos el producto en nuestro mock
      const product = PRODUCTS.find(p => p.productId === item.productId);

      if (!product) {
        // Si un producto del carrito no existe, rechazamos la orden
        return reject(new Error(`El producto con ID ${item.productId} no fue encontrado.`));
      }

      // 2. Usamos el PRECIO DEL MOCK (fuente de verdad)
      const itemSubtotal = product.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      // 3. Creamos el detalle de la orden
      details.push({
        detailId: Math.floor(Math.random() * 10000),
        orderId: 0, // Se asignará después
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price, // Precio del mock
        subtotal: itemSubtotal,
      });
    }

    // 4. Calculamos totales
    const iva = calculatedSubtotal * 0.19;
    const shipping = calculatedSubtotal > 50000 ? 0 : 4990;
    const total = calculatedSubtotal + iva + shipping;

    // 5. Creamos la orden
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
      statusId: 10, // 10 = 'Pendiente de Pago'
      userId: user.userId,
      details: details // Los detalles que acabamos de crear
    };
    for (const d of newOrder.details) {
      d.orderId = newOrder.orderId;
    }

    setTimeout(() => {
      resolve({ ok: true, statusCode: 201, order: newOrder });
    }, 1200);
  });
};

// (Cliente)
/** (READ) Simula la obtención de Órdenes para un usuario específico */
export const getOrdersByUserId = async (userId: number): Promise<OrdersByUserProps> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = ORDERS.filter(o => o.userId === userId);
      resolve({ ok: true, statusCode: 200, orders: results });
    }, 600);
  });
};

// (Admin)
/** (READ) Simula la obtención de TODAS las órdenes (para admin) */
export const getAllOrders = async (): Promise<OrdersByUserProps> => {
  console.log('Simulando API (Admin): Obteniendo TODAS las órdenes...');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ok: true, statusCode: 200, orders: ORDERS });
    }, 600);
  });
};

// (Admin)
/** (UPDATE) Simula la actualización del estado de una orden */
export const updateOrderStatus = async (orderId: number, statusId: number): Promise<OrderUpdateProps> => {
   return new Promise(resolve => {
     const order = ORDERS.find(o => o.orderId === orderId);
     if (order) {
       const updatedOrder = { ...order, statusId: statusId };
       resolve({ ok: true, statusCode: 200, order: updatedOrder });
     } else {
       resolve({ ok: false, statusCode: 404, order: {} as OrderProps });
     }
   });
};
import { ORDERS } from '../mocks'; // <-- Solo importamos ORDERS
import type { 
  OrderProps, 
  OrdersByUserProps, 
  OrderCreateProps,
  CartItemProps,
  UserProps
} from '../interfaces';

// (Cliente)
/** (CREATE) Simula la creación de una nueva Orden (Checkout) */
export const createOrder = async (
  cart: CartItemProps[], 
  user: UserProps, 
  idAddress: number
): Promise<OrderCreateProps> => {
  console.log(`Simulando API (Cliente): Creando nueva orden para: ${user.email}`);
  return new Promise(resolve => {
    // Lógica de cálculo
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = subtotal * 0.19;
    const shipping = subtotal > 50000 ? 0 : 4990;
    const total = subtotal + iva + shipping;
    const details = cart.map(item => ({
      idDetail: Math.floor(Math.random() * 10000),
      idOrder: 0,
      idProduct: item.idProduct,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    }));

    const newOrder: OrderProps = {
      idOrder: 999,
      orderNumber: `LPX-${Math.floor(Math.random() * 90000) + 10000}`,
      purchaseDate: new Date().toISOString(),
      subtotal, iva, shipping, total,
      paymentMethod: 'Transbank (Simulado)',
      idAddress: idAddress,
      idStatus: 10, // 10 = 'Pendiente de Pago' (del mock de STATUS)
      idUser: user.idUser,
      details: details
    };
    for (const d of newOrder.details) d.idOrder = newOrder.idOrder;

    setTimeout(() => {
      resolve({ ok: true, statusCode: 201, order: newOrder });
    }, 1200);
  });
};

// (Cliente)
/** (READ) Simula la obtención de Órdenes para un usuario específico */
export const getOrdersByUserId = async (idUser: number): Promise<OrdersByUserProps> => {
  console.log(`Simulando API (Cliente): Obteniendo Órdenes para Usuario ID: ${idUser}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const results = ORDERS.filter(o => o.idUser === idUser);
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
export const updateOrderStatus = async (idOrder: number, idStatus: number): Promise<OrderCreateProps> => {
   console.log(`Simulando API (Admin): Actualizando orden ${idOrder} a estado ${idStatus}`);
   return new Promise(resolve => {
     const order = ORDERS.find(o => o.idOrder === idOrder);
     if (order) {
       const updatedOrder = { ...order, idStatus: idStatus };
       resolve({ ok: true, statusCode: 200, order: updatedOrder });
     } else {
       resolve({ ok: false, statusCode: 404, order: {} as OrderProps });
     }
   });
};
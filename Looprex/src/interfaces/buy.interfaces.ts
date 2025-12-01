/**
 * Interfaces de Compras
 * NOTA: En el backend se llaman "Buys", no "Orders"
 */
/**
 * Estructura de una compra
 */
export interface BuyProps {
  buyId: number;
  orderNumber: string;      // ← AGREGAR
  buyDate: number;          // ← AGREGAR
  subtotal: number;
  iva: number;
  shipping: number;
  total: number;
  paymentMethod: string;    // ← AGREGAR
  statusId: number;
  addressId: number;
  userId: number;
}

/**
 * Respuesta al obtener todas las compras
 */
export interface BuysAllProps {
  ok: boolean;
  statusCode: number;
  buys: BuyProps[];
}

/**
 * Respuesta al obtener una compra por ID
 */
export interface BuyByIdProps {
  ok: boolean;
  statusCode: number;
  buy: BuyProps | null;
}

/**
 * Respuesta al crear una compra
 */
export interface BuyCreateProps {
  ok: boolean;
  statusCode: number;
  buy?: BuyProps;
  details?: any[];
  message?: string;
}

/**
 * Respuesta al actualizar una compra
 */
export interface BuyUpdateProps {
  ok: boolean;
  statusCode: number;
  message: string;
  buy?: BuyProps;
  
}
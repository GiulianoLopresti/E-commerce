/**
 * Interfaces del Carrito
/**
 * Item del carrito (local)
 */
export interface CartItemProps {
  productId: number;
  productName: string;
  productPhoto: string;
  price: number;
  quantity: number;
  stock: number;
}

/**
 * Estructura del carrito
 */
export interface Cart {
  items: CartItemProps[];
}

/**
 * Respuesta al agregar item al carrito
 */
export interface CartAddItemProps {
  ok: boolean;
  message: string;
  cart: Cart;
}

/**
 * Respuesta al actualizar cantidad
 */
export interface CartUpdateQuantityProps {
  ok: boolean;
  message: string;
  cart: Cart;
}

/**
 * Respuesta al eliminar item
 */
export interface CartRemoveItemProps {
  ok: boolean;
  message: string;
  cart: Cart;
}

/**
 * Respuesta al limpiar carrito
 */
export interface CartClearProps {
  ok: boolean;
  message: string;
}
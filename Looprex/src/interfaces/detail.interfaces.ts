/**
 * Interfaces de Detalles de Compra
 */

/**
 * Estructura de un detalle de compra
 */
export interface DetailProps {
  detailId: number;
  buyId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Respuesta al obtener detalles de una compra
 */
export interface DetailsAllProps {
  ok: boolean;
  statusCode: number;
  details: DetailProps[];
}

/**
 * Respuesta al crear un detalle
 */
export interface DetailCreateProps {
  ok: boolean;
  statusCode: number;
  message: string;
  detail?: DetailProps;
}
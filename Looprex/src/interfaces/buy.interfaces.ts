/**
 * Interfaces de Compras
 * NOTA: En el backend se llaman "Buys", no "Orders"
 */
import type { 
  DetailProps  // ← AGREGAR ESTE IMPORT
} from '@/interfaces';

/**
 * Estructura de una compra
 */
export interface BuyProps {
  buyId: number;
  userId: number;
  addressId: number;
  statusId: number;
  date: string; // ISO format
  total: number;
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
  message: string;
  buy?: BuyProps;
  details?: DetailProps[];
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
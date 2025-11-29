/**
 * Actions de Compras (Buys)
 * ACTUALIZADO: Ahora usa servicios API reales + nomenclatura correcta (Buy/Detail)
 * 
 * IMPORTANTE: El proceso de checkout requiere 2 pasos:
 * 1. Crear el Buy (orden)
 * 2. Crear los Details (items) con el buyId
 */

import { BuysService, DetailsService } from '@/services';
import type { BuyCreateProps, CartItemProps } from '@/interfaces';

/**
 * Obtener todas las compras (ADMIN)
 */
export const getAllBuys = async (): Promise<any> => {
  try {
    const response = await BuysService.getAll();
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        buys: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      buys: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener compras:', error);
    return {
      ok: false,
      statusCode: 500,
      buys: [],
    };
  }
};

/**
 * Obtener compras de un usuario
 */
export const getBuysByUserId = async (userId: number): Promise<any> => {
  try {
    const response = await BuysService.getByUserId(userId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        buys: [],
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      buys: response.data,
    };
  } catch (error: any) {
    console.error('Error al obtener compras del usuario:', error);
    return {
      ok: false,
      statusCode: 500,
      buys: [],
    };
  }
};

/**
 * Obtener una compra por ID con sus detalles
 */
export const getBuyById = async (buyId: number): Promise<any> => {
  try {
    // Obtener el Buy
    const buyResponse = await BuysService.getById(buyId);
    
    if (!buyResponse.success) {
      return {
        ok: false,
        statusCode: buyResponse.statusCode,
        buy: null,
        details: [],
      };
    }

    // Obtener los Details
    const detailsResponse = await DetailsService.getByBuyId(buyId);
    
    return {
      ok: true,
      statusCode: 200,
      buy: buyResponse.data,
      details: detailsResponse.success ? detailsResponse.data : [],
    };
  } catch (error: any) {
    console.error('Error al obtener compra:', error);
    return {
      ok: false,
      statusCode: 500,
      buy: null,
      details: [],
    };
  }
};

/**
 * Crear una compra (Checkout)
 * 
 * PROCESO:
 * 1. Crear el Buy con userId, addressId, statusId, total
 * 2. Con el buyId devuelto, crear cada Detail (producto del carrito)
 */
export const createBuyFromCart = async (
  cart: CartItemProps[],
  userId: number,
  addressId: number
): Promise<BuyCreateProps> => {
  try {
    // PASO 1: Calcular el total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // PASO 2: Crear el Buy
    const buyData = {
      userId,
      addressId,
      statusId: 3, // 3 = "Pendiente" (VERIFICA EN TU BD)
      date: new Date().toISOString(),
      total,
    };

    const buyResponse = await BuysService.create(buyData);
    
    if (!buyResponse.success) {
      return {
        ok: false,
        statusCode: buyResponse.statusCode,
        message: buyResponse.message || 'Error al crear la compra',
      };
    }

    const buyId = buyResponse.data.buyId;

    // PASO 3: Crear los Details (uno por cada item del carrito)
    const detailPromises = cart.map((item) => {
      const subtotal = item.price * item.quantity;
      return DetailsService.create({
        buyId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal,
      });
    });

    // Esperar a que se creen todos los details
    const detailResults = await Promise.all(detailPromises);
    
    // Verificar si algún detail falló
    const failedDetails = detailResults.filter(r => !r.success);
    if (failedDetails.length > 0) {
      console.warn('Algunos detalles no se crearon correctamente:', failedDetails);
    }

    return {
      ok: true,
      statusCode: 201,
      message: 'Compra realizada exitosamente',
      buy: buyResponse.data,
      details: detailResults.filter(r => r.success).map(r => r.data),
    };
  } catch (error: any) {
    console.error('Error al crear compra:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al procesar la compra',
    };
  }
};

/**
 * Actualizar el estado de una compra (ADMIN)
 */
export const updateBuyStatus = async (
  buyId: number,
  newStatusId: number
): Promise<{ ok: boolean; statusCode: number; message: string }> => {
  try {
    const response = await BuysService.update(buyId, newStatusId);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        message: response.message,
      };
    }

    return {
      ok: true,
      statusCode: response.statusCode,
      message: 'Estado de la compra actualizado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al actualizar estado de compra:', error);
    return {
      ok: false,
      statusCode: 500,
      message: 'Error al actualizar el estado',
    };
  }
};
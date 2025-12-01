/**
 * Actions de Compras (Buys)
 * ACTUALIZADO: Ahora usa servicios API reales + nomenclatura correcta (Buy/Detail)
 * 
 * IMPORTANTE: El proceso de checkout requiere 2 pasos:
 * 1. Crear el Buy (orden)
 * 2. Crear los Details (items) con el buyId
 */

import { BuysService, DetailsService } from '@/services';
import type { BuyCreateProps, CartItemProps, CreateBuyRequest, CreateDetailRequest } from '@/interfaces';
import { reduceProductStock } from './products.actions';

const toSnakeCase = (obj: any): any => {
  const snakeObj: any = {};
  
  const camelToSnake = (str: string): string => {
    return str.replaceAll(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  };
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      snakeObj[camelToSnake(key)] = obj[key];
    }
  }
  
  return snakeObj;
};

/**
 * Transforma objeto snake_case a camelCase (respuesta del backend)
 */
const toCamelCase = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const camelObj: any = {};
  
  const snakeToCamel = (str: string): string => {
    return str.replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  };
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      camelObj[snakeToCamel(key)] = obj[key];
    }
  }
  
  return camelObj;
};

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

    // MAPEAR CADA BUY A CAMELCASE
    const buys = response.data?.map((buy: any) => toCamelCase(buy)) || [];

    return {
      ok: true,
      statusCode: response.statusCode,
      buys: buys,
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
    
    console.log('🔍 Respuesta raw getBuysByUserId:', response);
    
    if (!response.success) {
      return {
        ok: false,
        statusCode: response.statusCode,
        buys: [],
      };
    }

    // MAPEAR CADA BUY A CAMELCASE
    const buys = response.data?.map((buy: any) => {
      const mapped = toCamelCase(buy);
      console.log('Buy mapeado:', mapped);
      return mapped;
    }) || [];

    console.log('Todos los buys mapeados:', buys);

    return {
      ok: true,
      statusCode: response.statusCode,
      buys: buys,
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
    console.log('🔍 Obteniendo buy con ID:', buyId);
    
    // Obtener el Buy
    const buyResponse = await BuysService.getById(buyId);
    
    console.log('🔍 Respuesta raw getBuyById:', buyResponse);
    
    if (!buyResponse.success) {
      return {
        ok: false,
        statusCode: buyResponse.statusCode,
        buy: null,
        details: [],
      };
    }

    // MAPEAR BUY A CAMELCASE
    const buy = toCamelCase(buyResponse.data);
    console.log('Buy mapeado:', buy);

    // Obtener los Details
    const detailsResponse = await DetailsService.getByBuyId(buyId);
    
    // MAPEAR CADA DETAIL A CAMELCASE
    const details = detailsResponse.success 
      ? detailsResponse.data?.map((detail: any) => toCamelCase(detail)) || []
      : [];

    console.log('Details mapeados:', details);
    
    return {
      ok: true,
      statusCode: 200,
      buy: buy,
      details: details,
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
 * Crear compra desde carrito
 */
export const createBuyFromCart = async (
  cartItems: CartItemProps[],
  userId: number,
  addressId: number
): Promise<BuyCreateProps> => {
  try {
    // Calcular montos
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const iva = Math.round(subtotal * 0.19);
    const shipping = subtotal > 50000 ? 0 : 5990;
    const total = subtotal + iva + shipping;

    // Generar número de orden único
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${year}-${random}-${timestamp.toString().slice(-4)}`;

    // Crear objeto en camelCase
    const buyData: CreateBuyRequest = {
      orderNumber: orderNumber,
      buyDate: now.getTime(),
      subtotal: subtotal,
      iva: iva,
      shipping: shipping,
      total: total,
      paymentMethod: "Webpay",
      statusId: 3,
      addressId: addressId,
      userId: userId
    };

    // Transformar a snake_case antes de enviar
    const buyDataSnakeCase = toSnakeCase(buyData);

    console.log('Enviando Buy:', buyDataSnakeCase);

    // Crear Buy primero
    const buyResponse = await BuysService.create(buyDataSnakeCase);

    if (!buyResponse.success) {
      return {
        ok: false,
        statusCode: buyResponse.statusCode,
        message: buyResponse.message || 'Error al crear la compra',
      };
    }

    console.log('Respuesta del backend:', buyResponse.data);

    const createdBuy = toCamelCase(buyResponse.data);

    console.log('Buy creado y mapeado:', createdBuy);
    console.log('buyId:', createdBuy.buyId);

    if (!createdBuy?.buyId) {
      console.error('Error: No se obtuvo buyId');
      return {
        ok: false,
        statusCode: 500,
        message: 'La compra se creó pero no se obtuvo el ID',
      };
    }

    // Crear detalles de la compra
    const details = [];
    for (const item of cartItems) {
      const detailData: CreateDetailRequest = {
        buyId: createdBuy.buyId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity
      };

      const detailDataSnakeCase = toSnakeCase(detailData);
      const detailResponse = await DetailsService.create(detailDataSnakeCase);

      if (detailResponse.success && detailResponse.data) {
        details.push(toCamelCase(detailResponse.data));

        // REDUCIR STOCK DESPUÉS DE CREAR EL DETALLE
        await reduceProductStock(item.productId, item.quantity);
      }
    }

    console.log('Compra creada exitosamente:', createdBuy);
    console.log('Detalles creados:', details);

    return {
      ok: true,
      statusCode: 201,
      message: 'Compra creada exitosamente',
      buy: createdBuy,
      details: details
    };

  } catch (error: any) {
    console.error('Error al crear compra:', error);
    return {
      ok: false,
      statusCode: error.response?.status || 500,
      message: error.message || 'Error al procesar la compra',
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
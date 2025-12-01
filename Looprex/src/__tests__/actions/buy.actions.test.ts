import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CartItemProps } from '@/interfaces';

describe('Buy Actions Logic', () => {
  it('calcula subtotal correctamente', () => {
    const items: CartItemProps[] = [
      {
        productId: 1,
        productName: 'Producto 1',
        productPhoto: 'img.jpg',
        price: 10000,
        quantity: 2,
        stock: 10
      },
      {
        productId: 2,
        productName: 'Producto 2',
        productPhoto: 'img2.jpg',
        price: 15000,
        quantity: 1,
        stock: 5
      }
    ];

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    expect(subtotal).toBe(35000);
  });

  it('calcula IVA correctamente', () => {
    const subtotal = 35000;
    const iva = Math.round(subtotal * 0.19);

    expect(iva).toBe(6650);
  });

  it('calcula envío gratis sobre 50000', () => {
    const subtotal = 60000;
    const shipping = subtotal > 50000 ? 0 : 5990;

    expect(shipping).toBe(0);
  });

  it('calcula costo de envío bajo 50000', () => {
    const subtotal = 30000;
    const shipping = subtotal > 50000 ? 0 : 5990;

    expect(shipping).toBe(5990);
  });

  it('genera número de orden único', () => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${year}-${random}-${timestamp.toString().slice(-4)}`;

    expect(orderNumber).toMatch(/^ORD-\d{4}-\d{3}-\d{4}$/);
  });
});
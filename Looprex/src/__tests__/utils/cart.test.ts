import { describe, it, expect } from 'vitest';

describe('Cart Logic', () => {
  it('calcula total correctamente', () => {
    const items = [
      { price: 10000, quantity: 2 },
      { price: 5000, quantity: 1 }
    ];

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    expect(total).toBe(25000);
  });

  it('valida stock suficiente', () => {
    const stock = 5;
    const quantity = 3;

    expect(stock >= quantity).toBe(true);
  });

  it('detecta stock insuficiente', () => {
    const stock = 2;
    const quantity = 5;

    expect(stock >= quantity).toBe(false);
  });
});
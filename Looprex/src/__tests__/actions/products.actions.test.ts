import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProducts, getProductById, reduceProductStock } from '@/actions/products.actions';
import { ProductsService } from '@/services';

vi.mock('@/services', () => ({
  ProductsService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
  }
}));

describe('Products Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('debería retornar productos exitosamente', async () => {
      const mockData = [
        {
          productId: 1,
          name: 'Producto 1',
          price: 10000,
          stock: 5,
          productPhoto: 'img.jpg',
          description: 'Desc',
          category: { categoryId: 1, name: 'Cat' },
          status: { statusId: 1, name: 'Activo' }
        }
      ];

      vi.mocked(ProductsService.getAll).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: mockData,
        message: 'OK'
      });

      const result = await getProducts();

      expect(result.ok).toBe(true);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe('Producto 1');
    });

    it('debería manejar errores', async () => {
      vi.mocked(ProductsService.getAll).mockResolvedValue({
        success: false,
        statusCode: 500,
        data: [],
        message: 'Error'
      });

      const result = await getProducts();

      expect(result.ok).toBe(false);
      expect(result.products).toEqual([]);
    });
  });

  describe('reduceProductStock', () => {
    it('debería reducir el stock correctamente', async () => {
      const mockProduct = {
        productId: 1,
        name: 'Producto',
        price: 10000,
        stock: 10,
        productPhoto: 'img.jpg',
        description: 'Desc',
        category: { categoryId: 1, name: 'Cat' },
        status: { statusId: 1, name: 'Activo' }
      };

      vi.mocked(ProductsService.getById).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: mockProduct,
        message: 'OK'
      });

      vi.mocked(ProductsService.update).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: { ...mockProduct, stock: 7 },
        message: 'OK'
      });

      const result = await reduceProductStock(1, 3);

      expect(result).toBe(true);
      expect(ProductsService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ stock: 7 })
      );
    });

    it('no debería reducir si no hay stock suficiente', async () => {
      const mockProduct = {
        productId: 1,
        name: 'Producto',
        price: 10000,
        stock: 2,
        productPhoto: 'img.jpg',
        description: 'Desc',
        category: { categoryId: 1, name: 'Cat' },
        status: { statusId: 1, name: 'Activo' }
      };

      vi.mocked(ProductsService.getById).mockResolvedValue({
        success: true,
        statusCode: 200,
        data: mockProduct,
        message: 'OK'
      });

      const result = await reduceProductStock(1, 5);

      expect(result).toBe(false);
      expect(ProductsService.update).not.toHaveBeenCalled();
    });
  });
});
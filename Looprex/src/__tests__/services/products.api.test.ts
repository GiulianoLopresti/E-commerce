import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductsService, CategoriesService } from '@/services';

// Mock global de fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('ProductsService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('debería obtener todos los productos', async () => {
    const mockProducts = [
      {
        productId: 1,
        name: 'Producto Test',
        price: 10000,
        stock: 5,
        productPhoto: 'https://test.com/img.jpg',
        description: 'Test',
        category: { categoryId: 1, name: 'Categoría Test' },
        status: { statusId: 1, name: 'Activo' }
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        statusCode: 200,
        data: mockProducts,
        message: 'OK'
      })
    });

    const result = await ProductsService.getAll();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Producto Test');
  });

  it('debería manejar errores al obtener productos', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        statusCode: 500,
        message: 'Error del servidor',
        data: []
      })
    });

    const result = await ProductsService.getAll();

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(500);
  });

  it('debería buscar productos por categoría', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        statusCode: 200,
        data: [],
        message: 'OK'
      })
    });

    await ProductsService.getByCategory(1);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/products/category/1'),
      expect.any(Object)
    );
  });
});

describe('CategoriesService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('debería crear una categoría', async () => {
    const newCategory = { categoryId: 1, name: 'Nueva Categoría' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        statusCode: 201,
        data: newCategory,
        message: 'Categoría creada'
      })
    });

    const result = await CategoriesService.create('Nueva Categoría');

    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Nueva Categoría');
  });
});
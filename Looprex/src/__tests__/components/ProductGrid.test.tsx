import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductGrid } from '@/components/common/product/ProductGrid';
import type { ProductProps } from '@/interfaces';

const mockProducts: ProductProps[] = [
  {
    productId: 1,
    name: 'Mouse Logitech G502',
    price: 49990,
    stock: 10,
    productPhoto: 'https://example.com/mouse.jpg',
    description: 'Mouse gamer',
    category: { categoryId: 3, name: 'Periféricos' },
    status: { statusId: 1, name: 'Activo' }
  },
  {
    productId: 2,
    name: 'Teclado Mecánico',
    price: 79990,
    stock: 5,
    productPhoto: 'https://example.com/keyboard.jpg',
    description: 'Teclado mecánico RGB',
    category: { categoryId: 3, name: 'Periféricos' },
    status: { statusId: 1, name: 'Activo' }
  },
  {
    productId: 3,
    name: 'Monitor 27"',
    price: 249990,
    stock: 3,
    productPhoto: 'https://example.com/monitor.jpg',
    description: 'Monitor gaming 144Hz',
    category: { categoryId: 4, name: 'Monitores' },
    status: { statusId: 1, name: 'Activo' }
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductGrid', () => {
  it('✓ debe renderizar lista de productos correctamente', () => {
    renderWithRouter(<ProductGrid products={mockProducts} />);

    expect(screen.getByText('Mouse Logitech G502')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(screen.getByText('Monitor 27"')).toBeInTheDocument();
  });

  it('✓ debe renderizar el número correcto de productos', () => {
    renderWithRouter(<ProductGrid products={mockProducts} />);

    const productCards = screen.getAllByRole('link');
    expect(productCards).toHaveLength(3);
  });

  it('✓ debe mostrar mensaje cuando no hay productos', () => {
    renderWithRouter(<ProductGrid products={[]} />);

    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
    
    // Verificar que el contenedor vacío existe
    const emptyState = screen.getByText('No se encontraron productos').closest('div');
    expect(emptyState).toBeInTheDocument();
  });

  it('✓ debe pasar onAddToCart a cada ProductCard', () => {
    const onAddToCart = vi.fn();
    renderWithRouter(
      <ProductGrid products={mockProducts} onAddToCart={onAddToCart} />
    );

    const addButtons = screen.getAllByRole('button', { name: /Añadir al carrito/i });
    expect(addButtons).toHaveLength(3);
  });

  it('✓ debe renderizar grid CSS correctamente', () => {
    const { container } = renderWithRouter(<ProductGrid products={mockProducts} />);

    const grid = container.querySelector('[class*="productGrid"]');
    expect(grid).toBeInTheDocument();
  });

  it('✓ debe mostrar estado vacío con icono apropiado', () => {
    renderWithRouter(<ProductGrid products={[]} />);

    const emptyState = screen.getByText('No se encontraron productos').closest('div');
    
    // Verificar que tiene la clase CSS correcta (usando substring match)
    expect(emptyState?.className).toContain('emptyState');
  });

  it('✓ debe manejar productos con diferentes estados', () => {
    const productsWithDifferentStates: ProductProps[] = [
      ...mockProducts,
      {
        productId: 4,
        name: 'Producto Agotado',
        price: 99990,
        stock: 0,
        productPhoto: 'https://example.com/out.jpg',
        description: 'Sin stock',
        category: { categoryId: 1, name: 'Componentes' },
        status: { statusId: 1, name: 'Activo' }
      }
    ];

    renderWithRouter(<ProductGrid products={productsWithDifferentStates} />);

    expect(screen.getByText('Producto Agotado')).toBeInTheDocument();
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});